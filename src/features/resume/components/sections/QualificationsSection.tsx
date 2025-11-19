import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Form, Grid } from "tabler-react-ui";
import { IconBadge, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { zCertificationCreate } from "@/client/zod.gen";
import { Resumes } from "@/client/sdk.gen";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import { ResumeDatePicker } from "../ResumeDatePicker";
import type { QualificationEntry } from "../../types/resume";
import { createEmptyQualificationEntry } from "../../utils/resumeDefaults";

type EntryErrors = Record<
  string,
  Partial<{
    qualificationName: string;
    acquisitionDate: string;
  }>
>;

export function QualificationsSection({ footer }: { footer?: ReactNode; }) {
  const { record, recordId, reload } = useResume();
  const [entries, setEntries] = useState<QualificationEntry[]>([]);
  const [entryErrors, setEntryErrors] = useState<EntryErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.qualifications) {
      setEntries(record.qualifications.length > 0 ? record.qualifications : [createEmptyQualificationEntry()]);
    } else {
      setEntries([createEmptyQualificationEntry()]);
    }
  }, [record?.qualifications]);

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

  const handleChange = <Key extends keyof QualificationEntry>(id: string | undefined, key: Key, value: QualificationEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
    const fieldKey =
      key === "qualificationName"
        ? "qualificationName"
        : key === "acquisitionDate"
          ? "acquisitionDate"
          : null;
    if (fieldKey) {
      clearEntryError(id, fieldKey);
    }
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyQualificationEntry()]);

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
      if (!entry.qualificationName.trim()) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          qualificationName: "Qualification name is required.",
        };
      }
      if (!entry.acquisitionDate) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          acquisitionDate: "Acquisition date is required.",
        };
      }
      return {
        acquisition_date: entry.acquisitionDate || "",
        certification_name: entry.qualificationName.trim(),
        remarks: entry.remarks?.trim() || null,
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
      const parsed = zCertificationCreate.safeParse(payload);
      if (!parsed.success) {
        setStatusMessage({
          type: "error",
          message: "Some qualification entries are invalid. Please review and try again.",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      if (record?.qualifications?.length) {
        await Promise.all(
          record.qualifications.map((entry) =>
            entry.id
              ? Resumes.resumesDeleteCertification({
                  path: { certification_id: entry.id },
                })
              : Promise.resolve(),
          ),
        );
      }
      for (const payload of payloads) {
        await Resumes.resumesCreateCertification({
          path: { resume_id: recordId },
          body: payload,
        });
      }
      await reload();
      setStatusMessage({ type: "success", message: "Qualifications saved successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save qualifications.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Qualifications"
      description="List professional qualifications, certifications, or licenses."
      actionsPlacement="footer"
      actions={
        <div className="d-flex gap-2">
          <Button type="button" outline color="primary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add qualification
          </Button>
          <Button color="success" outline type="submit" form="resume-qualifications-form" loading={isSaving}>
            <IconDeviceFloppy size={16} className="me-2" />
            Save qualifications
          </Button>
        </div>
      }
      icon={IconBadge}
      footer={footer}
    >
      <Form id="resume-qualifications-form" onSubmit={handleSubmit}>
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
                  <h3 className="h5 mb-0">Qualification {index + 1}</h3>
                  <Button
                    type="button"
                    outline
                    color="danger"
                    className="btn-sm"
                    disabled={entries.length === 1}
                    onClick={() => handleRemove(entry.id)}
                  >
                    <IconTrash size={16} className="me-1" />
                    Remove qualification {index + 1}
                  </Button>
                </div>
                <Grid.Row className="g-3">
                  <Grid.Col xs={12} md={6}>
                    <Form.Input
                      label="Qualification name"
                      value={entry.qualificationName}
                      onChange={(event) => handleChange(entry.id, "qualificationName", event.currentTarget.value)}
                      required
                    />
                    {errors?.qualificationName ? (
                      <div className="text-danger small mt-1">{errors.qualificationName}</div>
                    ) : null}
                  </Grid.Col>
                  <Grid.Col xs={12} md={6}>
                    <ResumeDatePicker
                      label="Acquisition date"
                      popperPlacement="bottom-start"
                      value={entry.acquisitionDate}
                      onChange={(value) => handleChange(entry.id, "acquisitionDate", value ?? "")}
                      required
                    />
                    {errors?.acquisitionDate ? (
                      <div className="text-danger small mt-1">{errors.acquisitionDate}</div>
                    ) : null}
                  </Grid.Col>
                  <Grid.Col xs={12}>
                    <Form.Textarea
                      label="Remarks"
                      rows={2}
                      value={entry.remarks ?? ""}
                      onChange={(event) => handleChange(entry.id, "remarks", event.currentTarget.value)}
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

