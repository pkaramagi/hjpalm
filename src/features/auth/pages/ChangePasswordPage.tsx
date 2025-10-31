import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, FormTextInput, Text } from 'tabler-react-ui';

import { AuthLayout } from '@/layouts/auth';
import type { ChangePasswordFields, ChangePasswordErrors } from '../types';

const INITIAL_VALUES: ChangePasswordFields = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const logoUrl = 'https://preview.tabler.io/static/logo.svg';

export function ChangePasswordPage() {
  const [values, setValues] = useState<ChangePasswordFields>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ChangePasswordErrors>({});
  const [status, setStatus] = useState<string | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const nextErrors: ChangePasswordErrors = {};

    if (!values.currentPassword) {
      nextErrors.currentPassword = 'Please enter your current password';
    }

    if (!values.newPassword) {
      nextErrors.newPassword = 'Please enter a new password';
    } else if (values.newPassword.length < 8) {
      nextErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (values.newPassword === values.currentPassword) {
      nextErrors.newPassword = 'New password must be different from the current password';
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = 'Please re-enter your new password';
    } else if (values.confirmPassword !== values.newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStatus('Password updated! Replace this handler with your backend integration.');
      setValues(INITIAL_VALUES);
    } else {
      setStatus(null);
    }
  };

  return (
    <AuthLayout
      logoUrl={logoUrl}
      afterCard={
        <Text>
          Want to double-check your profile?{' '}
          <Link className="text-reset" to="/auth/user-details">
            View user details
          </Link>
        </Text>
      }
    >
      <Card.Body>
        <h2 className="h2 text-center mb-2">Change password</h2>
        <Text muted className="text-center mb-4">
          Keep your account secure by using a strong, unique password that you haven&apos;t used before.
        </Text>

        <div className="bg-light border rounded p-3 mb-4 small text-muted">
          <strong>Tip:</strong> Use at least 8 characters and mix uppercase, lowercase, numbers, and symbols.
        </div>

        <form className="d-grid gap-3" onSubmit={handleSubmit} autoComplete="off" noValidate>
          <FormTextInput
            name="currentPassword"
            type="password"
            label="Current password"
            placeholder="Enter your current password"
            value={values.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
          />
          <FormTextInput
            name="newPassword"
            type="password"
            label="New password"
            placeholder="Choose a new password"
            value={values.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />
          <FormTextInput
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            placeholder="Re-enter your new password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <div className="form-footer">
            <Button type="submit" color="primary" className="w-100">
              Update password
            </Button>
          </div>
        </form>
      </Card.Body>
      {status ? (
        <Card.Body className="pt-0">
          <Text className="text-success text-center">{status}</Text>
        </Card.Body>
      ) : null}
    </AuthLayout>
  );
}

export default ChangePasswordPage;
