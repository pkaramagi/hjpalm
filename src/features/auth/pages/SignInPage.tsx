import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Form, FormCheckboxInput, FormTextInput, Text } from 'tabler-react-ui';

import { AuthLayout } from '@/layouts/auth';
import type { SignInFields, SignInErrors } from '../types';
import upa_logo from '@/assets/upa logo.svg';
const INITIAL_VALUES: SignInFields = {
  email: '',
  password: '',
  remember: true,
};

const logoUrl = upa_logo;

export function SignInPage() {
  const [values, setValues] = useState<SignInFields>(INITIAL_VALUES);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [status, setStatus] = useState<string | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, type, checked, value } = event.target;
    setValues((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const nextErrors: SignInErrors = {};
    if (!values.email) {
      nextErrors.email = 'Please provide an email address';
    }
    if (!values.password) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStatus('Signed in! Replace this handler with your auth flow.');
    } else {
      setStatus(null);
    }
  };

  return (
    <AuthLayout logoUrl={logoUrl}>
      <Card className="card card-md">
        <Card.Body>
          <h2 className="h2 text-center mb-2">Login to your account</h2>


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
            <div>

              <Form.Input
                name="password"
                type="password"
                label="Password"
                labelDescription={<Link to="/auth/forgot-password">Forgot password?</Link>}
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
              />

            </div>
            <div className="d-flex justify-content-between align-items-center">
              <FormCheckboxInput
                name="remember"
                label="Remember me on this device"
                onChange={handleChange}
                checked={values.remember}
              />

            </div>
            <div className="form-footer">
              <Button type="submit" color="primary" className="w-100">
                Sign in
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
          Don&apos;t have an account yet?{' '}
          <Link className="text-reset" to="/">
            Contact the team
          </Link>
        </Text>
      </div>
    </AuthLayout>
  );
}

export default SignInPage;
