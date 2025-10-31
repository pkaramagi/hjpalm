import { useEffect, useState, type ReactNode } from "react";
import { Button, Form, Grid } from "tabler-react-ui";
import { IconBuildingChurch, IconMinus, IconPlus } from "@tabler/icons-react";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { ChurchAppointmentEntry } from "../../types/resume";
import { createEmptyChurchAppointmentEntry } from "../../utils/resumeDefaults";

export function ChurchSection({ footer }: { footer?: ReactNode; }) {
  const { record, updateSection } = useResume();
  const [entries, setEntries] = useState<ChurchAppointmentEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.churchAppointments) {
      setEntries(
        record.churchAppointments.length > 0 ? record.churchAppointments : [createEmptyChurchAppointmentEntry()],
      );
    }
  }, [record?.churchAppointments]);

  const handleChange = <Key extends keyof ChurchAppointmentEntry>(id: string | undefined, key: Key, value: ChurchAppointmentEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyChurchAppointmentEntry()]);

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateSection("church", entries);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Church Appointments"
      description="Track church roles and responsibilities held over time."
      actions={
        <div className="d-flex gap-2">
          <Button type="button" color="secondary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add appointment
          </Button>
          <Button color="primary" type="submit" form="resume-church-form" loading={isSaving}>
            Save appointments
          </Button>
        </div>
      }
      icon={IconBuildingChurch}
      footer={footer}
    >

      <Form id="resume-church-form" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-4">
          {entries.map((entry, index) => (
            <Form.FieldSet key={entry.id ?? index} className="border rounded-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Appointment {index + 1}</h3>
                <Button type="button" color="danger" ghost disabled={entries.length === 1} onClick={() => handleRemove(entry.id)}>
                  <IconMinus size={16} className="me-1" />
                  Remove
                </Button>
              </div>
              <Grid.Row className="g-3">
                <Grid.Col xs={12} md={6}>
                  <Form.Input
                    label="Organization"
                    value={entry.organizationName}
                    onChange={(event) => handleChange(entry.id, "organizationName", event.currentTarget.value)}
                    required
                  />
                </Grid.Col>
                <Grid.Col xs={12} md={6}>
                  <Form.Input
                    label="Role / last position"
                    value={entry.lastPosition ?? ""}
                    onChange={(event) => handleChange(entry.id, "lastPosition", event.currentTarget.value)}
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
                    label="Responsibilities"
                    rows={3}
                    value={entry.responsibilities ?? ""}
                    onChange={(event) => handleChange(entry.id, "responsibilities", event.currentTarget.value)}
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












