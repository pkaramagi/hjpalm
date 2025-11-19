import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Form, FormCheckboxInput, FormTextInput, Text } from 'tabler-react-ui';
import { useMutation } from '@tanstack/react-query';
import { IconBrandGoogle, IconBrandKakoTalk } from '@tabler/icons-react';

import { authLoginMutation } from '@/client/@tanstack/react-query.gen';
import { zLoginRequest } from '@/client/zod.gen';
import { AuthLayout } from '@/layouts/auth';
import type { SignInErrors, SignInFields } from '../types';
import { useAuth } from '../hooks/useAuth';

const INITIAL_VALUES: SignInFields = {
  email: '',
  password: '',
  remember: true,
};


export function SignInPage() {
  const [values, setValues] = useState<SignInFields>(INITIAL_VALUES);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string; } | null>(null);

  const loginMutation = useMutation(authLoginMutation());
  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, type, checked, value } = event.target;
    setValues((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const parsed = zLoginRequest.safeParse({
      identifier: values.email,
      password: values.password,
    });

    if (!parsed.success) {
      const issueMap = parsed.error.issues.reduce<Record<string, string>>((acc, issue) => {
        const field = issue.path[0];
        if (typeof field === 'string' && !acc[field]) {
          acc[field] = issue.message;
        }
        return acc;
      }, {});
      setErrors({
        email: issueMap.identifier,
        password: issueMap.password,
      });
      setStatus(null);
      return;
    }

    setErrors({});
    setStatus(null);


    loginMutation.mutate(
      { body: parsed.data },
      {
        onSuccess: (data) => {
          setStatus({
            type: 'success',
            message: `Login Successful. Welcome back! Redirecting to dashboard...`,
          });

          // store auth tokens
          auth.storeToken(data);
          navigate('/', { replace: true });

        },
        onError: (error) => {
          setStatus({
            type: 'error',
            message: error instanceof Error ? error.message : 'Invalid email or password. Please try again.',
          });
        },
      },
    );
  };

  return (
    <AuthLayout
      cardClassName="p-1 signin"
      logoUrl={'../../assets/upa logo.svg'}
      afterCard={
        <div className="text-center text-secondary mt-3">
          <Text>
            Don&apos;t have an account yet?{' '}
            <Link className="text-reset" to="/">
              Contact the team
            </Link>
          </Text>
        </div>
      }
    >


      <Card.Body>
        <h2 className="h2 text-center mb-2">Login to your account</h2>


        {status ? (
          <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'}`} role="alert">
            {status.message}
          </div>
        ) : null}

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
          <div>
            <Button type="submit" color="primary" className="w-100" loading={loginMutation.isPending}>
              Sign in
            </Button>
          </div>
        </form>
      </Card.Body>

      <Card.Body>
        <div className="row">
          <div className="col">
            <a href="#" className="btn btn-4 btn-outline btn-yellow w-100">
              <IconBrandKakoTalk stroke={2} className='icon' />
              Login with KakaoTalk
            </a>
          </div>
          <div className="col">
            <a href="#" className="btn btn-4 btn-outline btn-success w-100">
              <IconBrandGoogle className='icon' />
              Login with Google
            </a>
          </div>
        </div>
      </Card.Body>



    </AuthLayout>
  );
}

export default SignInPage;
