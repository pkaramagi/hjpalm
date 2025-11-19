import { useEffect, useState, type ReactNode } from "react";
import { IconDeviceFloppy, IconUser } from "@tabler/icons-react";
import { Alert, Button, Form, Grid } from "tabler-react-ui";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { ResumeFormValues } from "../../types/resume";
import { resumeFormDefaults } from "../../utils/resumeDefaults";
import { ResumeDatePicker } from "../ResumeDatePicker";
import { zPersonalProfileCreate } from "@/client/zod.gen";
import { Resumes } from "@/client/sdk.gen";
import { EMAIL_PATTERN } from "../../utils/validators";

export function ProfileSection({ footer }: { footer?: ReactNode; }) {
  const { record, recordId, reload } = useResume();
  const [values, setValues] = useState<ResumeFormValues>(resumeFormDefaults);
  const [errors, setErrors] = useState<{ nameKorean?: string; email?: string; dateOfBirth?: string; }>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (record?.profile) {
      setValues((previous) => ({
        ...previous,
        ...record.profile,
        photoFile: null,
      }));
    }
  }, [record?.profile]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    const { name, value, type, checked } = event.currentTarget;
    setValues((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (name: keyof ResumeFormValues) => (value: string | undefined) => {
    setValues((previous) => ({
      ...previous,
      [name]: value ?? "",
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};

    if (!values.nameKorean.trim()) {
      nextErrors.nameKorean = "Korean name is required.";
    }

    if (values.email && !EMAIL_PATTERN.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.dateOfBirth) {
      nextErrors.dateOfBirth = "Birth date is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!recordId) {
      setStatusMessage({ type: "error", message: "Unable to determine the current resume." });
      return;
    }

    const englishNameFromInputs = [values.firstNameEnglish, values.lastNameEnglish]
      .filter((part) => part && part.trim().length > 0)
      .join(" ")
      .trim();
    const englishName = englishNameFromInputs || values.nameKorean.trim();

    const payload = {
      korean_name: values.nameKorean.trim(),
      english_name: englishName,
      birth_date: values.dateOfBirth!,
      chinese_name: values.nameHanja?.trim() || null,
      resident_number: values.residentId?.trim() || null,
      blessing_date: values.blessing ? values.blessing : null,
      appointment_date: values.admissionDate ? values.admissionDate : null,
      nationality: values.nationality?.trim() || null,
      organization: values.affiliation?.trim() || null,
      department: values.department?.trim() || null,
      position: values.positionTitle?.trim() || null,
      mobile_phone: values.mobilePhone?.trim() || null,
      extension: values.extensionNumber?.trim() || null,
      email: values.email?.trim() || null,
      address: values.address?.trim() || null,
      remarks: values.remarks?.trim() || null,
      profile_update_date: new Date().toISOString().split("T")[0],
      resume_id: recordId,
    };

    const parsed = zPersonalProfileCreate.safeParse(payload);
    if (!parsed.success) {
      setStatusMessage({
        type: "error",
        message: "Some profile fields are invalid. Please review and try again.",
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      if (record?.profileEntryId) {
        await Resumes.resumesDeleteProfile({
          path: { profile_id: record.profileEntryId },
        });
      }
      await Resumes.resumesCreateProfile({
        path: { resume_id: recordId },
        body: { ...parsed.data, resume_id: recordId },
      });
      await reload();
      setStatusMessage({ type: "success", message: "Profile saved successfully." });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Profile"
      description="Update base profile information that appears on generated resumes."
      actionsPlacement="footer"
      actions={
        <Button color="success" outline type="submit" form="resume-profile-form" loading={isSaving}>
          <IconDeviceFloppy size={16} className="me-2" />
          Save profile
        </Button>
      }
      icon={IconUser}
      footer={footer}
    >
      <Form id="resume-profile-form" onSubmit={handleSubmit}>
        {statusMessage ? (
          <Alert type={statusMessage.type === "success" ? "success" : "danger"} className="mb-3">
            {statusMessage.message}
          </Alert>
        ) : null}
        <Form.FieldSet className="resume-section-fieldset">
          <Grid.Row className="g-3">
            <Grid.Col xs={12} md={6}>
              <Form.Input
                label="Name (Korean) *"
                name="nameKorean"
                value={values.nameKorean}
                onChange={handleChange}
                required
                error={errors.nameKorean}
              />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input label="Name (Hanja)" name="nameHanja" value={values.nameHanja ?? ""} onChange={handleChange} />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input
                label="First name (English)"
                name="firstNameEnglish"
                value={values.firstNameEnglish ?? ""}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input
                label="Last name (English)"
                name="lastNameEnglish"
                value={values.lastNameEnglish ?? ""}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input label="Resident ID" name="residentId" value={values.residentId ?? ""} onChange={handleChange} />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <ResumeDatePicker
                label="Date of birth"
                value={values.dateOfBirth}
                onChange={handleDateChange("dateOfBirth")}
              />
              {errors.dateOfBirth ? <div className="text-danger small mt-1">{errors.dateOfBirth}</div> : null}
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input label="Nationality" name="nationality" value={values.nationality ?? ""} onChange={handleChange} />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input label="Department" name="department" value={values.department ?? ""} onChange={handleChange} />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input
                label="Extension number"
                name="extensionNumber"
                value={values.extensionNumber ?? ""}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input
                label="Mobile phone"
                name="mobilePhone"
                value={values.mobilePhone ?? ""}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col xs={12}>
              <Form.Textarea label="Address" name="address" rows={2} value={values.address ?? ""} onChange={handleChange} />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <ResumeDatePicker
                label="Blessing date"
                value={values.blessing}
                onChange={handleDateChange("blessing")}
              />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <ResumeDatePicker
                label="Admission date"
                value={values.admissionDate}
                onChange={handleDateChange("admissionDate")}
              />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input label="Affiliation" name="affiliation" value={values.affiliation ?? ""} onChange={handleChange} />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input
                label="Position title"
                name="positionTitle"
                value={values.positionTitle ?? ""}
                onChange={handleChange}
              />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input label="Rank title" name="rankTitle" value={values.rankTitle ?? ""} onChange={handleChange} />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input
                label="Email"
                name="email"
                type="email"
                value={values.email ?? ""}
                onChange={handleChange}
                error={errors.email}
              />
            </Grid.Col>
            <Grid.Col xs={12}>
              <Form.Textarea
                label="Remarks"
                name="remarks"
                rows={3}
                value={values.remarks ?? ""}
                onChange={handleChange}
              />
            </Grid.Col>
          </Grid.Row>
        </Form.FieldSet>
      </Form>
    </SectionCard>
  );
}
