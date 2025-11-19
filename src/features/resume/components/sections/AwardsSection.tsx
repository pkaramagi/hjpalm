import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Form, Grid } from "tabler-react-ui";
import { IconDeviceFloppy, IconPlus, IconTrash, IconTrophy } from "@tabler/icons-react";
import { zAwardCreate } from "@/client/zod.gen";
import { Resumes } from "@/client/sdk.gen";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import { ResumeDatePicker } from "../ResumeDatePicker";
import type { AwardEntry } from "../../types/resume";
import { createEmptyAwardEntry } from "../../utils/resumeDefaults";

type EntryErrors = Record<
  string,
  Partial<{
    awardType: string;
    awardDate: string;
    description: string;
  }>
>;

export function AwardsSection({ footer }: { footer?: ReactNode; }) {
  const { record, recordId, reload } = useResume();
  const [entries, setEntries] = useState<AwardEntry[]>([]);
  const [entryErrors, setEntryErrors] = useState<EntryErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.awards) {
      setEntries(record.awards.length > 0 ? record.awards : [createEmptyAwardEntry()]);
    } else {
      setEntries([createEmptyAwardEntry()]);
    }
  }, [record?.awards]);

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

  const handleChange = <Key extends keyof AwardEntry>(id: string | undefined, key: Key, value: AwardEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
    const fieldKey =
      key === "awardType"
        ? "awardType"
        : key === "awardDate"
          ? "awardDate"
          : key === "description"
            ? "description"
            : null;
    if (fieldKey) {
      clearEntryError(id, fieldKey);
    }
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyAwardEntry()]);

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
      if (!entry.awardType?.trim()) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          awardType: "Award type is required.",
        };
      }
      if (!entry.awardDate) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          awardDate: "Award date is required.",
        };
      }
      if (!entry.description?.trim()) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          description: "Description is required.",
        };
      }
      return {
        award_date: entry.awardDate || "",
        category: entry.awardType?.trim() || null,
        details: entry.description?.trim() || null,
        awarding_institution: entry.organization?.trim() || null,
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
      const parsed = zAwardCreate.safeParse(payload);
      if (!parsed.success) {
        setStatusMessage({
          type: "error",
          message: "Some award entries are invalid. Please review and try again.",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      if (record?.awards?.length) {
        await Promise.all(
          record.awards.map((entry) =>
            entry.id
              ? Resumes.resumesDeleteAward({
                  path: { award_id: entry.id },
                })
              : Promise.resolve(),
          ),
        );
      }
      for (const payload of payloads) {
        await Resumes.resumesCreateAward({
          path: { resume_id: recordId },
          body: payload,
        });
      }
      await reload();
      setStatusMessage({ type: "success", message: "Awards saved successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save awards.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Awards & Recognition"
      description="Capture honors, commendations, and official recognitions. Include the issuing organization and context."
      actionsPlacement="footer"
      actions={
        <div className="d-flex gap-2">
          <Button type="button" outline color="primary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add award
          </Button>
          <Button
            color="success"
            outline
            type="submit"
            form="resume-awards-form"
            loading={isSaving}
          >
            <IconDeviceFloppy size={16} className="me-2" />
            Save awards
          </Button>
        </div>
      }
      icon={IconTrophy}
      footer={footer}
    >
      <Form id="resume-awards-form" onSubmit={handleSubmit}>
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
                  <h3 className="h5 mb-0">Award {index + 1}</h3>
                  <Button
                    type="button"
                    outline
                    color="danger"
                    className="btn-sm"
                    disabled={entries.length === 1}
                    onClick={() => handleRemove(entry.id)}
                  >
                    <IconTrash size={16} className="me-1" />
                    Remove award {index + 1}
                  </Button>
                </div>
                <Grid.Row className="g-3">
                  <Grid.Col xs={12} md={6}>
                    <Form.Input
                      label="Award type *"
                      placeholder="Example: Employee of the Month"
                      value={entry.awardType ?? ""}
                      onChange={(event) => handleChange(entry.id, "awardType", event.currentTarget.value)}
                      required
                    />
                    {errors?.awardType ? <div className="text-danger small mt-1">{errors.awardType}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12} md={6}>
                    <ResumeDatePicker
                      label="Award date"
                      placeholderText="Select the award date"
                      hint="Please select a valid date."
                      value={entry.awardDate}
                      onChange={(value) => handleChange(entry.id, "awardDate", value ?? "")}
                      required
                    />
                    {errors?.awardDate ? <div className="text-danger small mt-1">{errors.awardDate}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12} md={6}>
                    <Form.Input
                      label="Organization"
                      placeholder="Example: UPA Headquarters"
                      value={entry.organization ?? ""}
                      onChange={(event) => handleChange(entry.id, "organization", event.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col xs={12}>
                    <Form.Textarea
                      label="Description *"
                      placeholder="Describe why the award was granted"
                      rows={3}
                      value={entry.description ?? ""}
                      onChange={(event) => handleChange(entry.id, "description", event.currentTarget.value)}
                      required
                    />
                    {errors?.description ? <div className="text-danger small mt-1">{errors.description}</div> : null}
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

