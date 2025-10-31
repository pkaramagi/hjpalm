import { useEffect, useState, type ReactNode } from "react";
import { Button, Form, Grid } from "tabler-react-ui";
import { IconCertificate, IconMinus, IconPlus } from "@tabler/icons-react";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { TrainingHistoryEntry } from "../../types/resume";
import { createEmptyTrainingEntry } from "../../utils/resumeDefaults";

export function TrainingSection({ footer }: { footer?: ReactNode; }) {
  const { record, updateSection } = useResume();
  const [entries, setEntries] = useState<TrainingHistoryEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.training) {
      setEntries(record.training.length > 0 ? record.training : [createEmptyTrainingEntry()]);
    }
  }, [record?.training]);

  const handleChange = <Key extends keyof TrainingHistoryEntry>(id: string | undefined, key: Key, value: TrainingHistoryEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyTrainingEntry()]);

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateSection("training", entries);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Training & Workshops"
      description="Track professional development history, including completion status."
      actions={
        <div className="d-flex gap-2">
          <Button type="button" color="secondary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add training
          </Button>
          <Button color="primary" type="submit" form="resume-training-form" loading={isSaving}>
            Save training
          </Button>
        </div>
      }
      icon={IconCertificate}
      footer={footer}
    >
      <Form id="resume-training-form" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-4">
          {entries.map((entry, index) => (
            <Form.FieldSet key={entry.id ?? index} className="border rounded-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Program {index + 1}</h3>
                <Button type="button" color="danger" ghost disabled={entries.length === 1} onClick={() => handleRemove(entry.id)}>
                  <IconMinus size={16} className="me-1" />
                  Remove
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
                  <Form.Input
                    label="Start date"
                    type="date"
                    value={entry.startDate ?? ""}
                    onChange={(event) => handleChange(entry.id, "startDate", event.currentTarget.value)}
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
                  <Form.Checkbox
                    label="Completed"
                    checked={Boolean(entry.completion)}
                    onChange={(event) => handleChange(entry.id, "completion", event.currentTarget.checked)}
                  />
                </Grid.Col>
              </Grid.Row>
            </Form.FieldSet>
          ))}
        </div>
      </Form>

    </SectionCard>
  );
}













