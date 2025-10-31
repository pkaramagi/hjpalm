import { useEffect, useState, type ReactNode } from "react";
import { Button, Form, Grid } from "tabler-react-ui";
import { IconMinus, IconPlus, IconNote } from "@tabler/icons-react";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { SpecialRemarkEntry } from "../../types/resume";
import { createEmptySpecialRemarkEntry } from "../../utils/resumeDefaults";

export function RemarksSection({ footer }: { footer?: ReactNode; }) {
  const { record, updateSection } = useResume();
  const [entries, setEntries] = useState<SpecialRemarkEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.specialRemarks) {
      setEntries(record.specialRemarks.length > 0 ? record.specialRemarks : [createEmptySpecialRemarkEntry()]);
    }
  }, [record?.specialRemarks]);

  const handleChange = <Key extends keyof SpecialRemarkEntry>(id: string | undefined, key: Key, value: SpecialRemarkEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptySpecialRemarkEntry()]);

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateSection("remarks", entries);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Special Remarks"
      description="Add notable observations or internal remarks."
      actions={
        <div className="d-flex gap-2">
          <Button type="button" color="secondary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add remark
          </Button>
          <Button color="primary" type="submit" form="resume-remarks-form" loading={isSaving}>
            Save remarks
          </Button>
        </div>
      }
      icon={IconNote}
      footer={footer}
    >

      <Form id="resume-remarks-form" onSubmit={handleSubmit}>
        <Form.FieldSet className="d-flex flex-column gap-4">
          {entries.map((entry, index) => (
            <div key={entry.id ?? index} className="border rounded-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Remark {index + 1}</h3>
                <Button type="button" color="danger" ghost disabled={entries.length === 1} onClick={() => handleRemove(entry.id)}>
                  <IconMinus size={16} className="me-1" />
                  Remove
                </Button>
              </div>
              <Grid.Row className="g-3">
                <Grid.Col xs={12} md={4}>
                  <Form.Input
                    label="Date"
                    type="date"
                    value={entry.entryDate}
                    onChange={(event) => handleChange(entry.id, "entryDate", event.currentTarget.value)}
                    required
                  />
                </Grid.Col>
                <Grid.Col xs={12}>
                  <Form.Textarea
                    label="Content"
                    rows={3}
                    value={entry.content}
                    onChange={(event) => handleChange(entry.id, "content", event.currentTarget.value)}
                    required
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












