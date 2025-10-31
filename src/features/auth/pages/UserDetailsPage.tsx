import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, FormTextInput, Text } from 'tabler-react-ui';

import { AuthLayout } from '@/layouts/auth';


type UserProfile = {
  initials: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  lastSignIn: string;
  location: string;
};

const logoUrl = 'https://preview.tabler.io/static/logo.svg';

export function UserDetailsPage() {
  const navigate = useNavigate();

  const userProfile = useMemo<UserProfile>(
    () => ({
      initials: 'JD',
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      role: 'Lead Product Designer',
      department: 'Product Design',
      phone: '+1 (555) 123-4567',
      lastSignIn: 'October 7, 2023 · 10:24 AM',
      location: 'San Francisco, CA',
    }),
    [],
  );

  return (
    <AuthLayout
      logoUrl={logoUrl}
      afterCard={
        <Text>
          Need to update something sensitive?{' '}
          <Link className="text-reset" to="/auth/change-password">
            Change your password
          </Link>
        </Text>
      }
    >
      <Card.Body className="d-grid gap-4">
        <div className="text-center">
          <Avatar color="blue" size="lg" className="mb-2">
            {userProfile.initials}
          </Avatar>
          <Text size="lg" className="mb-1">
            {userProfile.fullName}
          </Text>
          <Text muted size="sm">
            {userProfile.role}
          </Text>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <FormTextInput
              name="email"
              type="email"
              label="Email"
              value={userProfile.email}
              readOnly
            />
          </div>
          <div className="col-12 col-md-6">
            <FormTextInput
              name="department"
              label="Team"
              value={userProfile.department}
              readOnly
            />
          </div>
          <div className="col-12 col-md-6">
            <FormTextInput name="phone" label="Phone" value={userProfile.phone} readOnly />
          </div>
          <div className="col-12 col-md-6">
            <FormTextInput
              name="location"
              label="Location"
              value={userProfile.location}
              readOnly
            />
          </div>
        </div>

        <div className="bg-light border rounded p-3">
          <Text className="mb-1">
            <strong>Last sign-in</strong>
          </Text>
          <Text muted size="sm">
            {userProfile.lastSignIn}
          </Text>
        </div>

        <div className="form-footer d-grid gap-2">
          <Button type="button" color="primary" onClick={() => navigate('/auth/change-password')}>
            Change password
          </Button>
          <Button type="button" color="secondary" onClick={() => navigate('/auth/sign-in')}>
            Sign out
          </Button>
        </div>
      </Card.Body>
    </AuthLayout>
  );
}

export default UserDetailsPage;
