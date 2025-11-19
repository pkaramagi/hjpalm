import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, FormTextInput, Text } from 'tabler-react-ui';
import { AuthLayout } from '@/layouts/auth';
import type { ForgotPasswordFields, ForgotPasswordErrors } from '../types';

const INITIAL_VALUES: ForgotPasswordFields = {
  email: '',
};


export function ForgotPasswordPage() {
  const [values, setValues] = useState<ForgotPasswordFields>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
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

    const nextErrors: ForgotPasswordErrors = {};
    if (!values.email) {
      nextErrors.email = 'Please provide the email associated with your account';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStatus('If an account exists, we just sent password reset instructions.');
    } else {
      setStatus(null);
    }
  };

  return (
    <AuthLayout logoUrl={'../../assets/upa logo.svg'}>
      <Card className="card card-md">
        <Card.Body>
          <h2 className="h2 text-center mb-2">Forgot password?</h2>
          <Text muted className="text-center mb-4">
            No worries ! we will send a reset link to the email below.
          </Text>

          <form className="d-grid gap-3" onSubmit={handleSubmit} autoComplete="off" noValidate>
            <FormTextInput
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div className="form-footer">
              <Button type="submit" color="primary" className="w-100">
                Send reset email
              </Button>
            </div>
          </form>
        </Card.Body>
        {status ? (
          <Card.Body className="pt-0">
            <Text className="text-success text-center">{status}</Text>
          </Card.Body>
        ) : null}
      </Card>

      <div className="text-center text-secondary mt-3">
        <Text>
          Remembered your password?{' '}
          <Link className="text-reset" to="/auth/sign-in">
            Back to sign in
          </Link>
        </Text>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
