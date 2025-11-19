import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Form, Grid } from "tabler-react-ui";
import { IconDeviceFloppy, IconGavel, IconPlus, IconTrash } from "@tabler/icons-react";
import { zDisciplineRecordCreate } from "@/client/zod.gen";
import { Resumes } from "@/client/sdk.gen";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import { ResumeDatePicker } from "../ResumeDatePicker";
import type { DisciplineEntry } from "../../types/resume";
import { createEmptyDisciplineEntry } from "../../utils/resumeDefaults";

type EntryErrors = Record<
  string,
  Partial<{
    type: string;
    recordDate: string;
  }>
>;

export function DisciplineSection({ footer }: { footer?: ReactNode; }) {
  const { record, recordId, reload } = useResume();
  const [entries, setEntries] = useState<DisciplineEntry[]>([]);
  const [entryErrors, setEntryErrors] = useState<EntryErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.discipline) {
      setEntries(record.discipline.length > 0 ? record.discipline : [createEmptyDisciplineEntry()]);
    } else {
      setEntries([createEmptyDisciplineEntry()]);
    }
  }, [record?.discipline]);

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

  const handleChange = <Key extends keyof DisciplineEntry>(id: string | undefined, key: Key, value: DisciplineEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
    const fieldKey = key === "type" ? "type" : key === "recordDate" ? "recordDate" : null;
    if (fieldKey) {
      clearEntryError(id, fieldKey);
    }
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyDisciplineEntry()]);

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
      if (!entry.type.trim()) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          type: "Type is required.",
        };
      }
      if (!entry.recordDate) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          recordDate: "Record date is required.",
        };
      }
      return {
        record_date: entry.recordDate || "",
        type: entry.type.trim(),
        reason: entry.reason?.trim() || null,
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
      const parsed = zDisciplineRecordCreate.safeParse(payload);
      if (!parsed.success) {
        setStatusMessage({
          type: "error",
          message: "Some discipline records are invalid. Please review and try again.",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      if (record?.discipline?.length) {
        await Promise.all(
          record.discipline.map((entry) =>
            entry.id
              ? Resumes.resumesDeleteDisciplineRecord({
                  path: { record_id: entry.id },
                })
              : Promise.resolve(),
          ),
        );
      }
      for (const payload of payloads) {
        await Resumes.resumesCreateDisciplineRecord({
          path: { resume_id: recordId },
          body: payload,
        });
      }
      await reload();
      setStatusMessage({ type: "success", message: "Discipline records saved successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save discipline records.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Discipline & Coaching"
      description="Track coaching notes or disciplinary actions for internal reference."
      actionsPlacement="footer"
      actions={
        <div className="d-flex gap-2">
          <Button type="button" outline color="primary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add record
          </Button>
          <Button color="success" outline type="submit" form="resume-discipline-form" loading={isSaving}>
            <IconDeviceFloppy size={16} className="me-2" />
            Save records
          </Button>
        </div>
      }
      icon={IconGavel}
      footer={footer}
    >
      <Form id="resume-discipline-form" onSubmit={handleSubmit}>
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
                  <h3 className="h5 mb-0">Entry {index + 1}</h3>
                  <Button
                    type="button"
                    outline
                    color="danger"
                    className="btn-sm"
                    disabled={entries.length === 1}
                    onClick={() => handleRemove(entry.id)}
                  >
                    <IconTrash size={16} className="me-1" />
                    Remove record {index + 1}
                  </Button>
                </div>
                <Grid.Row className="g-3">
                  <Grid.Col xs={12} md={4}>
                    <Form.Input
                      label="Type"
                      value={entry.type}
                      onChange={(event) => handleChange(entry.id, "type", event.currentTarget.value)}
                      required
                    />
                    {errors?.type ? <div className="text-danger small mt-1">{errors.type}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12} md={4}>
                    <ResumeDatePicker
                      label="Record date"
                      value={entry.recordDate}
                      onChange={(value) => handleChange(entry.id, "recordDate", value ?? "")}
                      required
                    />
                    {errors?.recordDate ? <div className="text-danger small mt-1">{errors.recordDate}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12}>
                    <Form.Textarea
                      label="Reason / notes"
                      rows={3}
                      value={entry.reason ?? ""}
                      onChange={(event) => handleChange(entry.id, "reason", event.currentTarget.value)}
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

