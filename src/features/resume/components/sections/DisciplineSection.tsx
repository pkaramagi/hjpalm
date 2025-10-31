import { useEffect, useState, type ReactNode } from "react";
import { Button, Form, Grid } from "tabler-react-ui";
import { IconGavel, IconMinus, IconPlus } from "@tabler/icons-react";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { DisciplineEntry } from "../../types/resume";
import { createEmptyDisciplineEntry } from "../../utils/resumeDefaults";

export function DisciplineSection({ footer }: { footer?: ReactNode; }) {
  const { record, updateSection } = useResume();
  const [entries, setEntries] = useState<DisciplineEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.discipline) {
      setEntries(record.discipline.length > 0 ? record.discipline : [createEmptyDisciplineEntry()]);
    }
  }, [record?.discipline]);

  const handleChange = <Key extends keyof DisciplineEntry>(id: string | undefined, key: Key, value: DisciplineEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyDisciplineEntry()]);

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateSection("discipline", entries);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Discipline & Coaching"
      description="Track coaching notes or disciplinary actions for internal reference."
      actions={
        <div className="d-flex gap-2">
          <Button type="button" color="secondary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add record
          </Button>
          <Button color="primary" type="submit" form="resume-discipline-form" loading={isSaving}>
            Save records
          </Button>
        </div>
      }
      icon={IconGavel}
      footer={footer}
    >
      <Form id="resume-discipline-form" onSubmit={handleSubmit}>
        <Form.FieldSet className="d-flex flex-column gap-4">
          {entries.map((entry, index) => (
            <div key={entry.id ?? index} className="border rounded-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Entry {index + 1}</h3>
                <Button type="button" color="danger" ghost disabled={entries.length === 1} onClick={() => handleRemove(entry.id)}>
                  <IconMinus size={16} className="me-1" />
                  Remove
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
                </Grid.Col>
                <Grid.Col xs={12} md={4}>
                  <Form.Input
                    label="Record date"
                    type="date"
                    value={entry.recordDate}
                    onChange={(event) => handleChange(entry.id, "recordDate", event.currentTarget.value)}
                    required
                  />
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
            </div>
          ))}
        </Form.FieldSet>
      </Form>
    </SectionCard>
  );
}














