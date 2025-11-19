import { useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Form, Grid } from "tabler-react-ui";
import { IconDeviceFloppy, IconPlus, IconTrash, IconUsersGroup } from "@tabler/icons-react";
import { zFamilyMemberCreate } from "@/client/zod.gen";
import { Resumes } from "@/client/sdk.gen";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import { ResumeDatePicker } from "../ResumeDatePicker";
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

type EntryErrors = Record<
  string,
  Partial<{
    name: string;
  }>
>;

export function FamilySection({ footer }: { footer?: ReactNode; }) {
  const { record, recordId, reload } = useResume();
  const [entries, setEntries] = useState<FamilyInfoEntry[]>([]);
  const [entryErrors, setEntryErrors] = useState<EntryErrors>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.family) {
      setEntries(record.family.length > 0 ? record.family : [createEmptyFamilyEntry()]);
    } else {
      setEntries([createEmptyFamilyEntry()]);
    }
  }, [record?.family]);

  const clearEntryError = (entryId: string | undefined) => {
    if (!entryId) {
      return;
    }
    setEntryErrors((prev) => {
      if (!prev[entryId]) {
        return prev;
      }
      const { [entryId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleChange = <Key extends keyof FamilyInfoEntry>(id: string | undefined, key: Key, value: FamilyInfoEntry[Key]) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)),
    );
    if (key === "name") {
      clearEntryError(id);
    }
  };

  const handleAdd = () => setEntries((prev) => [...prev, createEmptyFamilyEntry()]);

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
      if (!entry.name.trim()) {
        localEntryErrors[entryId] = { name: "Name is required." };
      }
      return {
        relationship: entry.relation,
        name: entry.name.trim(),
        birth_date: entry.dateOfBirth || null,
        blessed: Boolean(entry.blessed),
        remarks: entry.remarks?.trim() || null,
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
      const parsed = zFamilyMemberCreate.safeParse(payload);
      if (!parsed.success) {
        setStatusMessage({
          type: "error",
          message: "Some family entries are invalid. Please review and try again.",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      if (record?.family?.length) {
        await Promise.all(
          record.family.map((entry) =>
            entry.id
              ? Resumes.resumesDeleteFamilyMember({
                  path: { member_id: entry.id },
                })
              : Promise.resolve(),
          ),
        );
      }
      for (const payload of payloads) {
        await Resumes.resumesCreateFamilyMember({
          path: { resume_id: recordId },
          body: payload,
        });
      }
      await reload();
      setStatusMessage({ type: "success", message: "Family information saved successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save family information.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Family"
      description="Capture immediate family relationships and key dates."
      actionsPlacement="footer"
      actions={
        <div className="d-flex gap-2">
          <Button type="button" className="" outline color="primary" onClick={handleAdd}>
            <IconPlus size={16} className="me-2" />
            Add member
          </Button>
          <Button color="success" type="submit" outline form="resume-family-form" loading={isSaving}>
            <IconDeviceFloppy size={16} className="me-2" /> Save family
          </Button>
        </div>
      }
      icon={IconUsersGroup}
      footer={footer}
    >
      <Form id="resume-family-form" onSubmit={handleSubmit}>
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
                  <h3 className="h5 mb-0">Family member {index + 1}</h3>
                  <Button type="button" outline color="danger" className="btn-sm" disabled={entries.length === 1} onClick={() => handleRemove(entry.id)}>
                    <IconTrash size={16} className="me-1" />
                    Remove Family member {index + 1}
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
                    {errors?.name ? <div className="text-danger small mt-1">{errors.name}</div> : null}
                  </Grid.Col>
                  <Grid.Col xs={12} md={4}>
                    <ResumeDatePicker
                      label="Date of birth"
                      value={entry.dateOfBirth}
                      onChange={(value) => handleChange(entry.id, "dateOfBirth", value ?? "")}
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
            );
          })}
        </div>
      </Form>
    </SectionCard>
  );
}

