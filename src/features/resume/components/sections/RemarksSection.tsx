import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Form, Grid } from "tabler-react-ui";
import { IconDeviceFloppy, IconNote, IconPlus, IconTrash } from "@tabler/icons-react";
import { zAdditionalRemarkCreate } from "@/client/zod.gen";
import { Resumes } from "@/client/sdk.gen";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import { ResumeDatePicker } from "../ResumeDatePicker";
import type { SpecialRemarkEntry } from "../../types/resume";
import { createEmptySpecialRemarkEntry } from "../../utils/resumeDefaults";

type EntryErrors = Record<
  string,
  Partial<{
    entryDate: string;
    content: string;
  }>
>;

export function RemarksSection({ footer }: { footer?: ReactNode; }) {
  const { record, recordId, reload } = useResume();
  const [entries, setEntries] = useState<SpecialRemarkEntry[]>([]);
  const [entryErrors, setEntryErrors] = useState<EntryErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.specialRemarks) {
      setEntries(record.specialRemarks.length > 0 ? record.specialRemarks : [createEmptySpecialRemarkEntry()]);
    } else {
      setEntries([createEmptySpecialRemarkEntry()]);
    }
  }, [record?.specialRemarks]);

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

  const handleChange = <Key extends keyof SpecialRemarkEntry>(id: string | undefined, key: Key, value: SpecialRemarkEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
    const fieldKey = key === "entryDate" ? "entryDate" : key === "content" ? "content" : null;
    if (fieldKey) {
      clearEntryError(id, fieldKey);
    }
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptySpecialRemarkEntry()]);

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
      if (!entry.entryDate) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          entryDate: "Date is required.",
        };
      }
      if (!entry.content.trim()) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          content: "Content is required.",
        };
      }
      return {
        registration_date: entry.entryDate || "",
        content: entry.content.trim(),
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
      const parsed = zAdditionalRemarkCreate.safeParse(payload);
      if (!parsed.success) {
        setStatusMessage({
          type: "error",
          message: "Some remarks are invalid. Please review and try again.",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      if (record?.specialRemarks?.length) {
        await Promise.all(
          record.specialRemarks.map((entry) =>
            entry.id
              ? Resumes.resumesDeleteRemark({
                  path: { remark_id: entry.id },
                })
              : Promise.resolve(),
          ),
        );
      }
      for (const payload of payloads) {
        await Resumes.resumesCreateRemark({
          path: { resume_id: recordId },
          body: payload,
        });
      }
      await reload();
      setStatusMessage({ type: "success", message: "Remarks saved successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save remarks.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Special Remarks"
      description="Add notable observations or internal remarks."
      actionsPlacement="footer"
      actions={
        <div className="d-flex gap-2">
          <Button type="button" outline color="primary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add remark
          </Button>
          <Button color="success" outline type="submit" form="resume-remarks-form" loading={isSaving}>
            <IconDeviceFloppy size={16} className="me-2" />
            Save remarks
          </Button>
        </div>
      }
      icon={IconNote}
      footer={footer}
    >
      <Form id="resume-remarks-form" onSubmit={handleSubmit}>
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
                  <h3 className="h5 mb-0">Remark {index + 1}</h3>
                  <Button
                    type="button"
                    outline
                    color="danger"
                    className="btn-sm"
                    disabled={entries.length === 1}
                    onClick={() => handleRemove(entry.id)}
                  >
                    <IconTrash size={16} className="me-1" />
                    Remove remark {index + 1}
                  </Button>
                </div>
                <Grid.Row className="g-3">
                  <Grid.Col xs={12} md={4}>
                    <ResumeDatePicker
                      label="Date"
                      value={entry.entryDate}
                      onChange={(value) => handleChange(entry.id, "entryDate", value ?? "")}
                      required
                    />
                    {errors?.entryDate ? <div className="text-danger small mt-1">{errors.entryDate}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12}>
                    <Form.Textarea
                      label="Content"
                      rows={3}
                      value={entry.content}
                      onChange={(event) => handleChange(entry.id, "content", event.currentTarget.value)}
                      required
                    />
                    {errors?.content ? <div className="text-danger small mt-1">{errors.content}</div> : null}
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

