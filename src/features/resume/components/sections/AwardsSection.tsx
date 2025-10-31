import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button, DatePicker, Form, Grid, Icon } from "tabler-react-ui";
import { IconCalendar, IconMinus, IconPlus, IconTrophy } from "@tabler/icons-react";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { AwardEntry } from "../../types/resume";
import { createEmptyAwardEntry } from "../../utils/resumeDefaults";

export function AwardsSection({ footer }: { footer?: ReactNode; }) {
  const { record, updateSection } = useResume();
  const [entries, setEntries] = useState<AwardEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  useEffect(() => {
    if (record?.awards) {
      setEntries(record.awards.length > 0 ? record.awards : [createEmptyAwardEntry()]);
    }
  }, [record?.awards]);

  const hasErrors = useMemo(
    () =>
      entries.some(
        (entry) =>
          !entry.awardType?.trim() ||
          !entry.description?.trim(),
      ),
    [entries],
  );

  const handleChange = <Key extends keyof AwardEntry>(id: string | undefined, key: Key, value: AwardEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyAwardEntry()]);

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (hasErrors) {
      return;
    }

    setIsSaving(true);
    try {
      await updateSection("awards", entries);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Awards & Recognition"
      description="Capture honors, commendations, and official recognitions. Include the issuing organization and context."
      actions={
        <div className="d-flex gap-2">
          <Button type="button" color="secondary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add award
          </Button>
          <Button
            color="primary"
            type="submit"
            form="resume-awards-form"
            loading={isSaving}
            disabled={hasErrors}
          >
            Save awards
          </Button>
        </div>
      }
      icon={IconTrophy}
      footer={footer}
    >
      <Form id="resume-awards-form" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-4">
          {entries.map((entry, index) => (
            <Form.FieldSet key={entry.id ?? index} className="border rounded-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Award {index + 1}</h3>
                <Button
                  type="button"
                  color="danger"
                  ghost
                  disabled={entries.length === 1}
                  onClick={() => handleRemove(entry.id)}
                >
                  <IconMinus size={16} className="me-1" />
                  Remove
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
                    invalid={!entry.awardType?.trim()}
                  />
                </Grid.Col>
                <Grid.Col xs={12} md={6}>

                  <DatePicker
                    label="Award Date"
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    placeholderText="Select the award date"
                    hint="Please select a valid date."
                    inputProps={{
                      icon: <IconCalendar size={16} />,
                    }}
                    popperProps={
                      { showPopperArrow: false }
                    }
                  />
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
                    invalid={!entry.description?.trim()}
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






