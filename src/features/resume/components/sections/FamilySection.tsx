import { useEffect, useState, type ReactNode } from "react";
import { Button, Form, Grid } from "tabler-react-ui";
import { IconMinus, IconPlus, IconUsersGroup } from "@tabler/icons-react";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { FamilyInfoEntry, FamilyRelation } from "../../types/resume";
import { createEmptyFamilyEntry } from "../../utils/resumeDefaults";

const relationOptions: Array<{ label: string; value: FamilyRelation; }> = [
  { label: "Father", value: "father" },
  { label: "Mother", value: "mother" },
  { label: "Older brother", value: "older_brother" },
  { label: "Younger brother", value: "younger_brother" },
  { label: "Older sister", value: "older_sister" },
  { label: "Younger sister", value: "younger_sister" },
  { label: "Spouse", value: "spouse" },
  { label: "Husband", value: "husband" },
  { label: "Son", value: "son" },
  { label: "Daughter", value: "daughter" },
];

export function FamilySection({ footer }: { footer?: ReactNode; }) {
  const { record, updateSection } = useResume();
  const [entries, setEntries] = useState<FamilyInfoEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.family) {
      setEntries(record.family.length > 0 ? record.family : [createEmptyFamilyEntry()]);
    }
  }, [record?.family]);

  const handleChange = <Key extends keyof FamilyInfoEntry>(id: string | undefined, key: Key, value: FamilyInfoEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyFamilyEntry()]);

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateSection("family", entries);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Family"
      description="Capture immediate family relationships and key dates."
      actions={
        <div className="d-flex gap-2">
          <Button type="button" color="secondary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add member
          </Button>
          <Button color="primary" type="submit" form="resume-family-form" loading={isSaving}>
            Save family
          </Button>
        </div>
      }
      icon={IconUsersGroup}
      footer={footer}
    >
      <Form id="resume-family-form" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-4">
          {entries.map((entry, index) => (
            <Form.FieldSet key={entry.id ?? index} className="border rounded-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Family member {index + 1}</h3>
                <Button type="button" color="danger" ghost disabled={entries.length === 1} onClick={() => handleRemove(entry.id)}>
                  <IconMinus size={16} className="me-1" />
                  Remove
                </Button>
              </div>
              <Grid.Row className="g-3">
                <Grid.Col xs={12} md={4}>
                  <Form.Select
                    label="Relation"
                    value={entry.relation}
                    onChange={(event) => handleChange(entry.id, "relation", event.currentTarget.value as FamilyRelation)}
                  >
                    {relationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Grid.Col>
                <Grid.Col xs={12} md={4}>
                  <Form.Input
                    label="Name"
                    value={entry.name}
                    onChange={(event) => handleChange(entry.id, "name", event.currentTarget.value)}
                    required
                  />
                </Grid.Col>
                <Grid.Col xs={12} md={4}>
                  <Form.Input
                    label="Date of birth"
                    type="date"
                    value={entry.dateOfBirth ?? ""}
                    onChange={(event) => handleChange(entry.id, "dateOfBirth", event.currentTarget.value)}
                  />
                </Grid.Col>
                <Grid.Col xs={12} md={4}>
                  <Form.Checkbox
                    label="Blessed"
                    checked={Boolean(entry.blessed)}
                    onChange={(event) => handleChange(entry.id, "blessed", event.currentTarget.checked)}
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














