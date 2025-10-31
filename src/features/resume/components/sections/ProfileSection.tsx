import { useEffect, useState, type ReactNode } from "react";
import { IconUser } from "@tabler/icons-react";
import { Button, Form, Grid } from "tabler-react-ui";
import { useResume } from "../ResumeContext";
import { SectionCard } from "../SectionCard";
import type { ResumeFormValues } from "../../types/resume";
import { resumeFormDefaults } from "../../utils/resumeDefaults";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileSection({ footer }: { footer?: ReactNode }) {
  const { record, updateSection } = useResume();
  const [values, setValues] = useState<ResumeFormValues>(resumeFormDefaults);
  const [errors, setErrors] = useState<{ nameKorean?: string; email?: string; }>({});
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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};

    if (!values.nameKorean.trim()) {
      nextErrors.nameKorean = "Korean name is required.";
    }

    if (values.email && !EMAIL_PATTERN.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);
    try {
      await updateSection("profile", values);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SectionCard
      title="Profile"
      description="Update base profile information that appears on generated resumes."
      actions={
        <Button color="primary" type="submit" form="resume-profile-form" loading={isSaving}>
          Save profile
        </Button>
      }
      icon={IconUser}
      footer={footer}
    >
      <Form id="resume-profile-form" onSubmit={handleSubmit}>
        <Form.FieldSet>
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
              <Form.Input
                label="Date of birth"
                name="dateOfBirth"
                type="date"
                value={values.dateOfBirth ?? ""}
                onChange={handleChange}
              />
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
              <Form.Input label="Blessing date" name="blessing" type="date" value={values.blessing ?? ""} onChange={handleChange} />
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Form.Input
                label="Admission date"
                name="admissionDate"
                type="date"
                value={values.admissionDate ?? ""}
                onChange={handleChange}
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








