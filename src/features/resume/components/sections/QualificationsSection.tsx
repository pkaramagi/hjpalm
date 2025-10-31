import { useEffect, useState, type ReactNode } from "react";
import { Button, Form, Grid } from "tabler-react-ui";
import { IconBadge, IconMinus, IconPlus } from "@tabler/icons-react";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { QualificationEntry } from "../../types/resume";
import { createEmptyQualificationEntry } from "../../utils/resumeDefaults";

export function QualificationsSection({ footer }: { footer?: ReactNode; }) {
  const { record, updateSection } = useResume();
  const [entries, setEntries] = useState<QualificationEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.qualifications) {
      setEntries(record.qualifications.length > 0 ? record.qualifications : [createEmptyQualificationEntry()]);
    }
  }, [record?.qualifications]);

  const handleChange = <Key extends keyof QualificationEntry>(id: string | undefined, key: Key, value: QualificationEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyQualificationEntry()]);

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateSection("qualifications", entries);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Qualifications"
      description="List professional qualifications, certifications, or licenses."
      actions={
        <div className="d-flex gap-2">
          <Button type="button" color="secondary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add qualification
          </Button>
          <Button color="primary" type="submit" form="resume-qualifications-form" loading={isSaving}>
            Save qualifications
          </Button>
        </div>
      }
      icon={IconBadge}
      footer={footer}
    >
      <Form id="resume-qualifications-form" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-4">
          {entries.map((entry, index) => (
            <Form.FieldSet key={entry.id ?? index} className="form-fieldset border rounded-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Qualification {index + 1}</h3>
                <Button type="button" color="danger" ghost disabled={entries.length === 1} onClick={() => handleRemove(entry.id)}>
                  <IconMinus size={16} className="me-1" />
                  Remove
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
                </Grid.Col>
                <Grid.Col xs={12} md={6}>
                  <Form.Input
                    label="Acquisition date"
                    type="date"
                    value={entry.acquisitionDate ?? ""}
                    onChange={(event) => handleChange(entry.id, "acquisitionDate", event.currentTarget.value)}
                  />
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
          ))}
        </div>
      </Form>
    </SectionCard>
  );
}














