import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Form, Grid } from "tabler-react-ui";
import { IconBuildingChurch, IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { zOrganizationalActivityCreate } from "@/client/zod.gen";
import { Resumes } from "@/client/sdk.gen";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import { ResumeDatePicker } from "../ResumeDatePicker";
import type { ChurchAppointmentEntry } from "../../types/resume";
import { createEmptyChurchAppointmentEntry } from "../../utils/resumeDefaults";

type EntryErrors = Record<
  string,
  Partial<{
    organizationName: string;
    startDate: string;
  }>
>;

export function ChurchSection({ footer }: { footer?: ReactNode; }) {
  const { record, recordId, reload } = useResume();
  const [entries, setEntries] = useState<ChurchAppointmentEntry[]>([]);
  const [entryErrors, setEntryErrors] = useState<EntryErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.churchAppointments) {
      setEntries(
        record.churchAppointments.length > 0 ? record.churchAppointments : [createEmptyChurchAppointmentEntry()],
      );
    } else {
      setEntries([createEmptyChurchAppointmentEntry()]);
    }
  }, [record?.churchAppointments]);

  const clearEntryError = (entryId: string | undefined, field?: keyof EntryErrors[string]) => {
    if (!entryId) {
      return;
    }
    setEntryErrors((prev) => {
      if (!prev[entryId]) {
        return prev;
      }
      if (!field) {
        const { [entryId]: _removed, ...rest } = prev;
        return rest;
      }
      const updated = { ...prev[entryId] };
      delete updated[field];
      if (Object.keys(updated).length === 0) {
        const { [entryId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [entryId]: updated };
    });
  };

  const handleChange = <Key extends keyof ChurchAppointmentEntry>(id: string | undefined, key: Key, value: ChurchAppointmentEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
    const fieldKey =
      key === "organizationName" ? "organizationName" : key === "startDate" ? "startDate" : null;
    if (fieldKey) {
      clearEntryError(id, fieldKey);
    }
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyChurchAppointmentEntry()]);

  const handleRemove = (id: string | undefined) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((entry) => entry.id !== id) : prev));
    clearEntryError(id);
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
      if (!entry.organizationName.trim()) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          organizationName: "Organization is required.",
        };
      }
      if (!entry.startDate) {
        localEntryErrors[entryId] = {
          ...localEntryErrors[entryId],
          startDate: "Start date is required.",
        };
      }
      return {
        start_date: entry.startDate || "",
        end_date: entry.endDate || null,
        organization_name: entry.organizationName.trim(),
        position: entry.lastPosition?.trim() || null,
        main_role: entry.responsibilities?.trim() || null,
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
      const parsed = zOrganizationalActivityCreate.safeParse(payload);
      if (!parsed.success) {
        setStatusMessage({
          type: "error",
          message: "Some church appointments are invalid. Please review and try again.",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      if (record?.churchAppointments?.length) {
        await Promise.all(
          record.churchAppointments.map((entry) =>
            entry.id
              ? Resumes.resumesDeleteActivity({
                  path: { activity_id: entry.id },
                })
              : Promise.resolve(),
          ),
        );
      }
      for (const payload of payloads) {
        await Resumes.resumesCreateActivity({
          path: { resume_id: recordId },
          body: payload,
        });
      }
      await reload();
      setStatusMessage({ type: "success", message: "Church appointments saved successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save church appointments.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Church Appointments"
      description="Track church roles and responsibilities held over time."
      actionsPlacement="footer"
      actions={
        <div className="d-flex gap-2">
          <Button type="button" outline color="primary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add appointment
          </Button>
          <Button color="success" outline type="submit" form="resume-church-form" loading={isSaving}>
            <IconDeviceFloppy size={16} className="me-2" />
            Save appointments
          </Button>
        </div>
      }
      icon={IconBuildingChurch}
      footer={footer}
    >
      <Form id="resume-church-form" onSubmit={handleSubmit}>
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
                  <h3 className="h5 mb-0">Appointment {index + 1}</h3>
                  <Button
                    type="button"
                    outline
                    color="danger"
                    className="btn-sm"
                    disabled={entries.length === 1}
                    onClick={() => handleRemove(entry.id)}
                  >
                    <IconTrash size={16} className="me-1" />
                    Remove appointment {index + 1}
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
                    {errors?.organizationName ? (
                      <div className="text-danger small mt-1">{errors.organizationName}</div>
                    ) : null}
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
                    <ResumeDatePicker
                      label="Start date"
                      value={entry.startDate}
                      onChange={(value) => handleChange(entry.id, "startDate", value ?? "")}
                      required
                    />
                    {errors?.startDate ? <div className="text-danger small mt-1">{errors.startDate}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12} md={3}>
                    <ResumeDatePicker
                      label="End date"
                      value={entry.endDate}
                      onChange={(value) => handleChange(entry.id, "endDate", value ?? "")}
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
            );
          })}
        </div>
      </Form>
    </SectionCard>
  );
}

