import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Form, Grid } from "tabler-react-ui";
import { IconCertificate, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { zTrainingProgramCreate } from "@/client/zod.gen";
import { Resumes } from "@/client/sdk.gen";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import { ResumeDatePicker } from "../ResumeDatePicker";
import type { TrainingHistoryEntry } from "../../types/resume";
import { createEmptyTrainingEntry } from "../../utils/resumeDefaults";

type EntryErrors = Record<
  string,
  Partial<{
    courseName: string;
    startDate: string;
    endDate: string;
  }>
>;

export function TrainingSection({ footer }: { footer?: ReactNode; }) {
  const { record, recordId, reload } = useResume();
  const [entries, setEntries] = useState<TrainingHistoryEntry[]>([]);
  const [entryErrors, setEntryErrors] = useState<EntryErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.training) {
      setEntries(record.training.length > 0 ? record.training : [createEmptyTrainingEntry()]);
    } else {
      setEntries([createEmptyTrainingEntry()]);
    }
  }, [record?.training]);

  const clearEntryError = (entryId: string | undefined, field?: keyof EntryErrors[string]) => {
    if (!entryId) {
      return;
    }
    setEntryErrors((prev) => {
      if (!prev[entryId]) {
        return prev;
      }
      if (!field) {
        const { [entryId]: _removed, ...rest } = prev;
        return rest;
      }
      const updated = { ...prev[entryId] };
      delete updated[field];
      if (Object.keys(updated).length === 0) {
        const { [entryId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [entryId]: updated };
    });
  };

  const handleChange = <Key extends keyof TrainingHistoryEntry>(id: string | undefined, key: Key, value: TrainingHistoryEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
    const fieldKey =
      key === "courseName" ? "courseName" : key === "startDate" ? "startDate" : key === "endDate" ? "endDate" : null;
    if (fieldKey) {
      clearEntryError(id, fieldKey);
    }
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyTrainingEntry()]);

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
    clearEntryError(id);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setStatusMessage(null);

    if (!recordId) {
      setStatusMessage({ type: "error", message: "Unable to determine the current resume." });
      return;
    }

    const localEntryErrors: EntryErrors = {};
    const payloads = entries.map((entry, index) => {
      const entryId = entry.id ?? `entry-${index}`;
      if (!entry.courseName.trim()) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          courseName: "Course name is required.",
        };
      }
      if (!entry.startDate) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          startDate: "Start date is required.",
        };
      }
      if (!entry.endDate) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          endDate: "End date is required.",
        };
      }
      return {
        program_name: entry.courseName.trim(),
        start_date: entry.startDate || "",
        end_date: entry.endDate || "",
        organizing_institution: entry.organizer?.trim() || null,
        completion_status: Boolean(entry.completion),
        display_order: index,
        resume_id: recordId,
      };
    });

    if (Object.keys(localEntryErrors).length > 0) {
      setEntryErrors(localEntryErrors);
      setStatusMessage({ type: "error", message: "Please correct validation errors." });
      return;
    }
    setEntryErrors({});

    for (const payload of payloads) {
      const parsed = zTrainingProgramCreate.safeParse(payload);
      if (!parsed.success) {
        setStatusMessage({
          type: "error",
          message: "Some training entries are invalid. Please review and try again.",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      if (record?.training?.length) {
        await Promise.all(
          record.training.map((entry) =>
            entry.id
              ? Resumes.resumesDeleteTraining({
                  path: { program_id: entry.id },
                })
              : Promise.resolve(),
          ),
        );
      }
      for (const payload of payloads) {
        await Resumes.resumesCreateTraining({
          path: { resume_id: recordId },
          body: payload,
        });
      }
      await reload();
      setStatusMessage({ type: "success", message: "Training history saved successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save training history.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Training & Workshops"
      description="Track professional development history, including completion status."
      actionsPlacement="footer"
      actions={
        <div className="d-flex gap-2">
          <Button type="button" outline color="primary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add training
          </Button>
          <Button color="success" outline type="submit" form="resume-training-form" loading={isSaving}>
            <IconDeviceFloppy size={16} className="me-2" />
            Save training
          </Button>
        </div>
      }
      icon={IconCertificate}
      footer={footer}
    >
      <Form id="resume-training-form" onSubmit={handleSubmit}>
        {statusMessage ? (
          <Alert type={statusMessage.type === "success" ? "success" : "danger"} className="mb-3">
            {statusMessage.message}
          </Alert>
        ) : null}
        <div className="d-flex flex-column gap-4">
          {entries.map((entry, index) => {
            const entryId = entry.id ?? `entry-${index}`;
            const errors = entryErrors[entryId];
            return (
              <Form.FieldSet key={entryId} className="resume-section-fieldset">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 mb-0">Program {index + 1}</h3>
                  <Button
                    type="button"
                    outline
                    color="danger"
                    className="btn-sm"
                    disabled={entries.length === 1}
                    onClick={() => handleRemove(entry.id)}
                  >
                    <IconTrash size={16} className="me-1" />
                    Remove training {index + 1}
                  </Button>
                </div>
                <Grid.Row className="g-3">
                  <Grid.Col xs={12} md={6}>
                    <Form.Input
                      label="Course name"
                      value={entry.courseName}
                      onChange={(event) => handleChange(entry.id, "courseName", event.currentTarget.value)}
                      required
                    />
                    {errors?.courseName ? <div className="text-danger small mt-1">{errors.courseName}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12} md={6}>
                    <Form.Input
                      label="Category"
                      value={entry.category ?? ""}
                      onChange={(event) => handleChange(entry.id, "category", event.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col xs={12} md={6}>
                    <Form.Input
                      label="Organizer"
                      value={entry.organizer ?? ""}
                      onChange={(event) => handleChange(entry.id, "organizer", event.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col xs={12} md={3}>
                    <ResumeDatePicker
                      label="Start date"
                      value={entry.startDate}
                      onChange={(value) => handleChange(entry.id, "startDate", value ?? "")}
                      required
                    />
                    {errors?.startDate ? <div className="text-danger small mt-1">{errors.startDate}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12} md={3}>
                    <ResumeDatePicker
                      label="End date"
                      value={entry.endDate}
                      onChange={(value) => handleChange(entry.id, "endDate", value ?? "")}
                      required
                    />
                    {errors?.endDate ? <div className="text-danger small mt-1">{errors.endDate}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12}>
                    <Form.Checkbox
                      label="Completed"
                      checked={Boolean(entry.completion)}
                      onChange={(event) => handleChange(entry.id, "completion", event.currentTarget.checked)}
                    />
                  </Grid.Col>
                </Grid.Row>
              </Form.FieldSet>
            );
          })}
        </div>
      </Form>
    </SectionCard>
  );
}

