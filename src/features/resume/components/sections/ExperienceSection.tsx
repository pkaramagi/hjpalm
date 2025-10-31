import { useEffect, useState, type ReactNode } from "react";
import { Button, Form, Grid } from "tabler-react-ui";
import { IconBriefcase, IconMinus, IconPlus } from "@tabler/icons-react";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { WorkExperienceEntry } from "../../types/resume";
import { createEmptyWorkExperienceEntry } from "../../utils/resumeDefaults";

export function ExperienceSection({ footer }: { footer?: ReactNode; }) {
  const { record, updateSection } = useResume();
  const [entries, setEntries] = useState<WorkExperienceEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.workExperience) {
      setEntries(record.workExperience.length > 0 ? record.workExperience : [createEmptyWorkExperienceEntry()]);
    }
  }, [record?.workExperience]);

  const handleChange = <Key extends keyof WorkExperienceEntry>(id: string | undefined, key: Key, value: WorkExperienceEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
  };

  const handleAdd = () => {
    setEntries((prev) => [...prev, createEmptyWorkExperienceEntry()]);
  };

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateSection("experience", entries);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Career Experience"
      description="Record professional experience, responsibilities, and timelines."
      actions={
        <div className="d-flex gap-2">
          <Button type="button" color="secondary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add experience
          </Button>
          <Button color="primary" type="submit" form="resume-experience-form" loading={isSaving}>
            Save experience
          </Button>
        </div>
      }
      icon={IconBriefcase}
      footer={footer}    >
      <Form id="resume-experience-form" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-4">
          {entries.map((entry, index) => (
            <Form.FieldSet key={entry.id ?? index} className="border rounded-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Position {index + 1}</h3>
                <Button type="button" color="danger" ghost disabled={entries.length === 1} onClick={() => handleRemove(entry.id)}>
                  <IconMinus size={16} className="me-1" />
                  Remove
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
                </Grid.Col>
                <Grid.Col xs={12} md={6}>
                  <Form.Input
                    label="Final position"
                    value={entry.finalPosition}
                    onChange={(event) => handleChange(entry.id, "finalPosition", event.currentTarget.value)}
                    required
                  />
                </Grid.Col>
                <Grid.Col xs={12} md={6}>
                  <Form.Input
                    label="Department"
                    value={entry.department ?? ""}
                    onChange={(event) => handleChange(entry.id, "department", event.currentTarget.value)}
                  />
                </Grid.Col>
                <Grid.Col xs={12} md={3}>
                  <Form.Input
                    label="Start date"
                    type="date"
                    value={entry.startDate}
                    onChange={(event) => handleChange(entry.id, "startDate", event.currentTarget.value)}
                    required
                  />
                </Grid.Col>
                <Grid.Col xs={12} md={3}>
                  <Form.Input
                    label="End date"
                    type="date"
                    value={entry.endDate ?? ""}
                    onChange={(event) => handleChange(entry.id, "endDate", event.currentTarget.value)}
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
          ))}
        </div>
      </Form>
    </SectionCard >
  );
}







