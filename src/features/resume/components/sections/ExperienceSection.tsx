import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Form, Grid } from "tabler-react-ui";
import { IconBriefcase, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { zWorkExperienceCreate } from "@/client/zod.gen";
import { Resumes } from "@/client/sdk.gen";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import { ResumeDatePicker } from "../ResumeDatePicker";
import type { WorkExperienceEntry } from "../../types/resume";
import { createEmptyWorkExperienceEntry } from "../../utils/resumeDefaults";

type EntryErrors = Record<
  string,
  Partial<{
    companyName: string;
    finalPosition: string;
    startDate: string;
  }>
>;

export function ExperienceSection({ footer }: { footer?: ReactNode; }) {
  const { record, recordId, reload } = useResume();
  const [entries, setEntries] = useState<WorkExperienceEntry[]>([]);
  const [entryErrors, setEntryErrors] = useState<EntryErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.workExperience) {
      setEntries(record.workExperience.length > 0 ? record.workExperience : [createEmptyWorkExperienceEntry()]);
    } else {
      setEntries([createEmptyWorkExperienceEntry()]);
    }
  }, [record?.workExperience]);

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

  const handleChange = <Key extends keyof WorkExperienceEntry>(id: string | undefined, key: Key, value: WorkExperienceEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
    const fieldKey =
      key === "companyName" ? "companyName" : key === "finalPosition" ? "finalPosition" : key === "startDate" ? "startDate" : null;
    if (fieldKey) {
      clearEntryError(id, fieldKey);
    }
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyWorkExperienceEntry()]);

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
      if (!entry.companyName.trim()) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          companyName: "Company name is required.",
        };
      }
      if (!entry.finalPosition.trim()) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          finalPosition: "Final position is required.",
        };
      }
      if (!entry.startDate) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          startDate: "Start date is required.",
        };
      }
      return {
        start_date: entry.startDate || "",
        end_date: entry.endDate || null,
        organization: entry.companyName.trim(),
        department: entry.department?.trim() || null,
        position: entry.finalPosition?.trim() || null,
        responsibilities: entry.jobDescription?.trim() || null,
        current_job: !entry.endDate,
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
      const parsed = zWorkExperienceCreate.safeParse(payload);
      if (!parsed.success) {
        setStatusMessage({
          type: "error",
          message: "Some experience entries are invalid. Please review and try again.",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      if (record?.workExperience?.length) {
        await Promise.all(
          record.workExperience.map((entry) =>
            entry.id
              ? Resumes.resumesDeleteWorkExperience({
                  path: { experience_id: entry.id },
                })
              : Promise.resolve(),
          ),
        );
      }
      for (const payload of payloads) {
        await Resumes.resumesCreateWorkExperience({
          path: { resume_id: recordId },
          body: payload,
        });
      }
      await reload();
      setStatusMessage({ type: "success", message: "Career experience saved successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save experience entries.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Career Experience"
      description="Record professional experience, responsibilities, and timelines."
      actionsPlacement="footer"
      actions={
        <div className="d-flex gap-2">
          <Button type="button" outline color="primary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add experience
          </Button>
          <Button color="success" outline type="submit" form="resume-experience-form" loading={isSaving}>
            <IconDeviceFloppy size={16} className="me-2" />
            Save experience
          </Button>
        </div>
      }
      icon={IconBriefcase}
      footer={footer}
    >
      <Form id="resume-experience-form" onSubmit={handleSubmit}>
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
                  <h3 className="h5 mb-0">Position {index + 1}</h3>
                  <Button
                    type="button"
                    outline
                    color="danger"
                    className="btn-sm"
                    disabled={entries.length === 1}
                    onClick={() => handleRemove(entry.id)}
                  >
                    <IconTrash size={16} className="me-1" />
                    Remove experience {index + 1}
                  </Button>
                </div>
                <Grid.Row className="g-3">
                  <Grid.Col xs={12} md={6}>
                    <Form.Input
                      label="Company"
                      value={entry.companyName}
                      onChange={(event) => handleChange(entry.id, "companyName", event.currentTarget.value)}
                      required
                    />
                    {errors?.companyName ? <div className="text-danger small mt-1">{errors.companyName}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12} md={6}>
                    <Form.Input
                      label="Final position"
                      value={entry.finalPosition}
                      onChange={(event) => handleChange(entry.id, "finalPosition", event.currentTarget.value)}
                      required
                    />
                    {errors?.finalPosition ? <div className="text-danger small mt-1">{errors.finalPosition}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12} md={6}>
                    <Form.Input
                      label="Department"
                      value={entry.department ?? ""}
                      onChange={(event) => handleChange(entry.id, "department", event.currentTarget.value)}
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
                    />
                  </Grid.Col>
                  <Grid.Col xs={12}>
                    <Form.Textarea
                      label="Responsibilities / achievements"
                      rows={3}
                      value={entry.jobDescription ?? ""}
                      onChange={(event) => handleChange(entry.id, "jobDescription", event.currentTarget.value)}
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

