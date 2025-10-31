import { useEffect, useState, type ReactNode } from "react";
import { Button, Form, Grid } from "tabler-react-ui";
import { IconMinus, IconPlus, IconSchool } from "@tabler/icons-react";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { EducationHistoryEntry, GraduationStatus, DegreeType } from "../../types/resume";
import { createEmptyEducationEntry } from "../../utils/resumeDefaults";

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

export function EducationSection({ footer }: { footer?: ReactNode; }) {
  const { record, updateSection } = useResume();
  const [entries, setEntries] = useState<EducationHistoryEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.education) {
      setEntries(record.education.length > 0 ? record.education : [createEmptyEducationEntry()]);
    }
  }, [record?.education]);

  const handleChange = <Key extends keyof EducationHistoryEntry>(id: string | undefined, key: Key, value: EducationHistoryEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
  };

  const handleAdd = () => {
    setEntries((prev) => [...prev, createEmptyEducationEntry()]);
  };

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateSection("education", entries);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Education"
      description="Document academic history, degrees, and study periods."
      actions={
        <div className="d-flex gap-2">
          <Button color="secondary" type="button" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add institution
          </Button>
          <Button color="primary" type="submit" form="resume-education-form" loading={isSaving}>
            Save education
          </Button>
        </div>
      }
      icon={IconSchool}
      footer={footer}
    >
      <Form id="resume-education-form" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-4">
          {entries.map((entry, index) => (
            <Form.FieldSet key={entry.id ?? index} className="border rounded-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Institution {index + 1}</h3>
                <Button type="button" color="danger" ghost disabled={entries.length === 1} onClick={() => handleRemove(entry.id)}>
                  <IconMinus size={16} className="me-1" />
                  Remove
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
                  <Form.Input
                    label="Start date"
                    type="date"
                    name="startDate"
                    value={entry.startDate}
                    onChange={(event) => handleChange(entry.id, "startDate", event.currentTarget.value)}
                    required
                  />
                </Grid.Col>
                <Grid.Col xs={12} md={6}>
                  <Form.Input
                    label="End date"
                    type="date"
                    name="endDate"
                    value={entry.endDate ?? ""}
                    onChange={(event) => handleChange(entry.id, "endDate", event.currentTarget.value)}
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
          ))}
        </div>
      </Form>
    </SectionCard>
  );
}
















