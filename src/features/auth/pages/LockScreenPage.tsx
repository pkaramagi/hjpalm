import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Card, FormTextInput, Text } from 'tabler-react-ui';

import { AuthLayout } from '@/layouts/auth';
import type { LockScreenFields, LockScreenErrors } from '../types';

const INITIAL_VALUES: LockScreenFields = {
  password: '',
};

const logoUrl = 'https://preview.tabler.io/static/logo.svg';

export function LockScreenPage() {
  const [values, setValues] = useState<LockScreenFields>(INITIAL_VALUES);
  const [errors, setErrors] = useState<LockScreenErrors>({});
  const [status, setStatus] = useState<string | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setValues({ password: value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!values.password) {
      setErrors({ password: 'Password is required to unlock the session' });
      setStatus(null);
      return;
    }

    setErrors({});
    setStatus('Welcome back! Redirect to your dashboard after verifying credentials.');
  };

  return (
    <AuthLayout logoUrl={logoUrl}>
      <Card className="card card-md">
        <Card.Body>
          <h2 className="h2 text-center mb-2">Session locked</h2>
          <Text muted className="text-center mb-4">
            Enter your password to resume work.
          </Text>

          <div className="text-center mb-4">
            <Avatar color="blue" size="lg" className="mb-2">
              JD
            </Avatar>
            <Text size="lg" className="mb-1">
              Jane Doe
            </Text>
            <Text muted size="sm">
              Lead Product Designer
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="d-grid gap-3" autoComplete="off" noValidate>
            <FormTextInput
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Button type="submit" color="primary" className="w-100">
              Unlock
            </Button>
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
          Not you?{' '}
          <Link className="text-reset" to="/auth/sign-in">
            Sign in as a different user
          </Link>
        </Text>
      </div>
    </AuthLayout>
  );
}

export default LockScreenPage;
