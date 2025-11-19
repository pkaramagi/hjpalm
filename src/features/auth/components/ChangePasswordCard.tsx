import { Button, Card, FormTextInput, Text } from "tabler-react-ui";
import { usePasswordForm, type PasswordFormFields } from "../hooks/usePasswordForm";

interface ChangePasswordCardProps {
  onSubmit: (values: PasswordFormFields) => void | Promise<void>;
  statusMessage?: string | null;
}

export function ChangePasswordCard({ onSubmit, statusMessage }: ChangePasswordCardProps) {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = usePasswordForm({
    onSubmit,
  });

  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title
          subtitle="Use a strong password that you do not reuse anywhere else."
          className="mb-0"
        >
          Change password
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <form className="d-grid gap-3" onSubmit={handleSubmit} noValidate>
          <FormTextInput
            name="currentPassword"
            type="password"
            label="Current password"
            placeholder="Enter your current password"
            value={values.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            autoComplete="current-password"
          />
          <FormTextInput
            name="newPassword"
            type="password"
            label="New password"
            placeholder="Choose a new password"
            value={values.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            autoComplete="new-password"
          />
          <FormTextInput
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            placeholder="Re-enter your new password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
          <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center">
            <Button type="submit" color="primary" loading={isSubmitting}>
              Update password
            </Button>
            {statusMessage ? (
              <Text className="text-success small mb-0">{statusMessage}</Text>
            ) : null}
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}
