import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Form, Grid } from "tabler-react-ui";
import { IconDeviceFloppy, IconPlus, IconSchool, IconTrash } from "@tabler/icons-react";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import { ResumeDatePicker } from "../ResumeDatePicker";
import type { EducationHistoryEntry, GraduationStatus, DegreeType } from "../../types/resume";
import { createEmptyEducationEntry } from "../../utils/resumeDefaults";
import { zEducationHistoryCreate } from "@/client/zod.gen";
import { Resumes } from "@/client/sdk.gen";

const graduationOptions: Array<{ label: string; value: GraduationStatus; }> = [
  { label: "Graduated", value: "graduated" },
  { label: "Enrolled", value: "enrolled" },
  { label: "Dropped out", value: "dropped_out" },
  { label: "Completed coursework", value: "completed" },
  { label: "On leave", value: "on_leave" },
];

const degreeOptions: Array<{ label: string; value: DegreeType; }> = [
  { label: "Bachelor", value: "bachelor" },
  { label: "Master", value: "master" },
  { label: "Doctorate", value: "doctorate" },
  { label: "Other", value: "other" },
];

type EntryErrors = Record<string, Partial<{ schoolNameKor: string; startDate: string; }>>;

export function EducationSection({ footer }: { footer?: ReactNode; }) {
  const { record, recordId, reload } = useResume();
  const [entries, setEntries] = useState<EducationHistoryEntry[]>([createEmptyEducationEntry()]);
  const [entryErrors, setEntryErrors] = useState<EntryErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.education) {
      setEntries(record.education.length > 0 ? record.education : [createEmptyEducationEntry()]);
    } else {
      setEntries([createEmptyEducationEntry()]);
    }
  }, [record?.education]);

  const handleChange = <Key extends keyof EducationHistoryEntry>(id: string | undefined, key: Key, value: EducationHistoryEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
    const entryId = id;
    if (!entryId) {
      return;
    }
    const fieldKey = key === "schoolNameKor" ? "schoolNameKor" : key === "startDate" ? "startDate" : null;
    if (!fieldKey) {
      return;
    }
    setEntryErrors((prev) => {
      if (!prev[entryId]) return prev;
      const updated = { ...prev[entryId] };
      delete updated[fieldKey];
      if (Object.keys(updated).length === 0) {
        const { [entryId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [entryId]: updated };
    });
  };

  const handleAdd = () => {
    setEntries((prev) => [...prev, createEmptyEducationEntry()]);
  };

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
    if (id) {
      setEntryErrors((prev) => {
        if (!prev[id]) return prev;
        const { [id]: _removed, ...rest } = prev;
        return rest;
      });
    }
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
      if (!entry.schoolNameKor.trim()) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          schoolNameKor: "School name is required.",
        };
      }
      if (!entry.startDate) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          startDate: "Start date is required.",
        };
      }
      const startDate = entry.startDate;
      const endDate = entry.endDate || entry.startDate;
      return {
        start_date: startDate || "",
        end_date: endDate || "",
        institution: entry.schoolNameKor.trim(),
        major: entry.majorKor?.trim() || null,
        graduation_type: entry.graduationStatus ?? null,
        degree: entry.degree ?? null,
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
      const parsed = zEducationHistoryCreate.safeParse(payload);
      if (!parsed.success) {
        setStatusMessage({ type: "error", message: "Some education entries are invalid. Please review and try again." });
        return;
      }
    }

    setIsSaving(true);
    try {
      if (record?.education?.length) {
        await Promise.all(
          record.education
            .map((entry) =>
              entry.id
                ? Resumes.resumesDeleteEducation({
                    path: { entry_id: entry.id },
                  })
                : Promise.resolve(),
            ),
        );
      }
      for (const payload of payloads) {
        await Resumes.resumesCreateEducation({
          path: { resume_id: recordId },
          body: payload,
        });
      }
      await reload();
      setStatusMessage({ type: "success", message: "Education history saved successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save education history.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Education"
      description="Document academic history, degrees, and study periods."
      actionsPlacement="footer"
      actions={
        <div className="d-flex gap-2">
          <Button color="primary" outline type="button" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add institution
          </Button>
          <Button color="success" outline type="submit" form="resume-education-form" loading={isSaving}>
            <IconDeviceFloppy size={16} className="me-2" />
            Save education
          </Button>
        </div>
      }
      icon={IconSchool}
      footer={footer}
    >
      <Form id="resume-education-form" onSubmit={handleSubmit}>
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
                <h3 className="h5 mb-0">Institution {index + 1}</h3>
                <Button
                  type="button"
                  outline
                  color="danger"
                  className="btn-sm"
                  disabled={entries.length === 1}
                  onClick={() => handleRemove(entry.id)}
                >
                  <IconTrash size={16} className="me-1" />
                  Remove institution {index + 1}
                </Button>
              </div>
              <Grid.Row className="g-3">
                <Grid.Col xs={12} md={6}>
                  <Form.Input
                    label="School (Korean)"
                    name="schoolNameKor"
                    value={entry.schoolNameKor}
                    onChange={(event) => handleChange(entry.id, "schoolNameKor", event.currentTarget.value)}
                    required
                  />
                  {errors?.schoolNameKor ? <div className="text-danger small mt-1">{errors.schoolNameKor}</div> : null}
                </Grid.Col>
                <Grid.Col xs={12} md={6}>
                  <Form.Input
                    label="Major (Korean)"
                    name="majorKor"
                    value={entry.majorKor}
                    onChange={(event) => handleChange(entry.id, "majorKor", event.currentTarget.value)}
                    required
                  />
                </Grid.Col>
                <Grid.Col xs={12} md={6}>
                  <ResumeDatePicker
                    label="Start date"
                    value={entry.startDate}
                    onChange={(value) =>
                      handleChange(entry.id, "startDate", value ?? "")
                    }
                    required
                  />
                  {errors?.startDate ? <div className="text-danger small mt-1">{errors.startDate}</div> : null}
                </Grid.Col>
                <Grid.Col xs={12} md={6}>
                  <ResumeDatePicker
                    label="End date"
                    value={entry.endDate}
                    onChange={(value) => handleChange(entry.id, "endDate", value)}
                  />
                </Grid.Col>
                <Grid.Col xs={12} md={6}>
                  <Form.Select
                    label="Graduation status"
                    value={entry.graduationStatus}
                    onChange={(event) =>
                      handleChange(entry.id, "graduationStatus", event.currentTarget.value as GraduationStatus)
                    }
                  >
                    {graduationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Grid.Col>
                <Grid.Col xs={12} md={6}>
                  <Form.Select
                    label="Degree"
                    value={entry.degree ?? ""}
                    onChange={(event) =>
                      handleChange(entry.id, "degree", (event.currentTarget.value as DegreeType) || undefined)
                    }
                  >
                    <option value="">Select degree</option>
                    {degreeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Grid.Col>
              </Grid.Row>
            </Form.FieldSet>
          )})}
        </div>
      </Form>
    </SectionCard>
  );
}
















