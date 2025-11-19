import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Avatar, Button, Card, FormTextInput, Text } from 'tabler-react-ui';

import { AuthLayout } from '@/layouts/auth';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { LockScreenErrors, LockScreenFields } from '../types';

const INITIAL_VALUES: LockScreenFields = {
  password: '',
};

export function LockScreenPage() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<LockScreenErrors>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user, login, unlock, locked } = useAuth();

  const identifier = useMemo(() => user?.email ?? user?.username ?? user?.name ?? '', [user]);
  const initials = useMemo(() => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((segment) => segment[0])
        .join('')
        .slice(0, 3)
        .toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'UP';
  }, [user?.email, user?.name]);

  if (!locked) {
    return <Navigate to="/" replace />;
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setValues({ password: event.target.value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!values.password) {
      setErrors({ password: 'Password is required to unlock the session' });
      setStatus(null);
      return;
    }
    if (!identifier) {
      setStatus({ type: 'error', message: 'Unable to unlock: missing active user session.' });
      return;
    }
    setErrors({});
    setStatus(null);
    setSubmitting(true);
    try {
      await login({ identifier, password: values.password });
      unlock();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to unlock session.',
      });
    } finally {
      setSubmitting(false);
      setValues(INITIAL_VALUES);
    }
  };

  return (
    <AuthLayout logoUrl={'../../../assets/upa logo.svg'}>
      <Card className="card card-md">
        <Card.Body>
          <h2 className="h2 text-center mb-2">Session locked</h2>
          <Text muted className="text-center mb-4">
            Enter your password to resume work.
          </Text>

          <div className="text-center mb-4">
            <Avatar color="blue" size="lg" className="mb-2">
              {initials}
            </Avatar>
            <Text size="lg" className="mb-1">
              {user?.name ?? 'Current user'}
            </Text>
            <Text muted size="sm">
              {user?.email ?? user?.username ?? 'Locked session'}
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

            <Button type="submit" color="primary" className="w-100" loading={submitting}>
              Unlock
            </Button>
          </form>
        </Card.Body>
        {status ? (
          <Card.Body className="pt-0">
            <Text className={`text-center text-${status.type === 'success' ? 'success' : 'danger'}`}>
              {status.message}
            </Text>
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
