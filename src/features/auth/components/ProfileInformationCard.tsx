import { useMemo } from "react";
import { Button, Card, FormTextInput, Text } from "tabler-react-ui";
import { useProfileForm, type ProfileFormFields } from "../hooks/useProfileForm";

interface ProfileInformationCardProps {
  initialValues: ProfileFormFields;
  onSubmit: (values: ProfileFormFields) => void | Promise<void>;
  statusMessage?: string | null;
}

export function ProfileInformationCard({
  initialValues,
  onSubmit,
  statusMessage,
}: ProfileInformationCardProps) {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useProfileForm({
    initialValues,
    onSubmit,
  });

  const appearanceHint = useMemo(
    () =>
      `This information is visible to teammates across the resume tools. Keeping it up to date helps others find you quickly.`,
    []
  );

  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title subtitle={appearanceHint} className="mb-0">
          Profile information
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <form className="row g-3" onSubmit={handleSubmit} noValidate>
          <div className="col-12 col-md-6">
            <FormTextInput
              name="fullName"
              label="Full name *"
              value={values.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
          </div>
          <div className="col-12 col-md-6">
            <FormTextInput
              name="jobTitle"
              label="Role / Title *"
              value={values.jobTitle}
              onChange={handleChange}
              error={errors.jobTitle}
            />
          </div>
          <div className="col-12 col-md-6">
            <FormTextInput
              name="email"
              type="email"
              label="Email *"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>
          <div className="col-12 col-md-6">
            <FormTextInput
              name="department"
              label="Department *"
              value={values.department}
              onChange={handleChange}
              error={errors.department}
            />
          </div>
          <div className="col-12 col-md-6">
            <FormTextInput
              name="phone"
              label="Phone number *"
              value={values.phone}
              onChange={handleChange}
              error={errors.phone}
            />
          </div>
          <div className="col-12 col-md-6">
            <FormTextInput
              name="location"
              label="Location *"
              value={values.location}
              onChange={handleChange}
              error={errors.location}
            />
          </div>

          <div className="col-12">
            <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center">
              <Button type="submit" color="primary" loading={isSubmitting}>
                Save changes
              </Button>
              {statusMessage ? (
                <Text className="text-success small mb-0">{statusMessage}</Text>
              ) : null}
            </div>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}
