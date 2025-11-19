import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, Card, Container, FormTextInput, Page, Text } from "tabler-react-ui";

import { AuthLayout } from "@/layouts/auth";
import type {
  ChangePasswordErrors,
  ChangePasswordFields,
} from "@/features/auth/types";

type ProfileSettings = {
  fullName: string;
  email: string;
  department: string;
  phone: string;
  location: string;
  jobTitle: string;
  avatarUrl: string;
};

type ProfileErrors = Partial<Record<keyof ProfileSettings, string>>;

const INITIAL_PROFILE: ProfileSettings = {
  fullName: "Jane Doe",
  email: "jane.doe@example.com",
  department: "Global Missions",
  phone: "+82 10-0000-0000",
  location: "Seoul, South Korea",
  jobTitle: "UPA Regional Coordinator",
  avatarUrl: "https://preview.tabler.io/static/avatars/000m.jpg",
};

const PASSWORD_DEFAULTS: ChangePasswordFields = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const PROFILE_FIELD_LABELS: Record<keyof ProfileSettings, string> = {
  fullName: "Full name",
  email: "Email",
  department: "Department",
  phone: "Phone number",
  location: "Location",
  jobTitle: "Role / Title",
  avatarUrl: "Avatar",
};

export function AccountSettingsPage() {
  const [profile, setProfile] = useState<ProfileSettings>(INITIAL_PROFILE);
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [profileStatus, setProfileStatus] = useState<string | null>(null);

  const [passwordValues, setPasswordValues] =
    useState<ChangePasswordFields>(PASSWORD_DEFAULTS);
  const [passwordErrors, setPasswordErrors] =
    useState<ChangePasswordErrors>({});
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl);
  const [avatarStatus, setAvatarStatus] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const appearanceHint = useMemo(
    () =>
      `This information is visible to teammates across the resume tools. Keeping it up to date helps others find you quickly.`,
    [],
  );

  const handleProfileChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { name, value } = target;
    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileSubmit: React.FormEventHandler<HTMLFormElement> = (
    event,
  ) => {
    event.preventDefault();
    const nextErrors: ProfileErrors = {};

    (Object.keys(PROFILE_FIELD_LABELS) as Array<keyof ProfileSettings>)
      .filter((field) => field !== "avatarUrl")
      .forEach((field) => {
        if (!profile[field].trim()) {
          nextErrors[field] = `${PROFILE_FIELD_LABELS[field]} is required`;
        }
      });

    setProfileErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setProfileStatus(null);
      return;
    }

    setProfileStatus(
      "Profile updated! Replace this handler with your backend integration.",
    );
  };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { name, value } = target;
    setPasswordValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordSubmit: React.FormEventHandler<HTMLFormElement> = (
    event,
  ) => {
    event.preventDefault();
    const nextErrors: ChangePasswordErrors = {};

    if (!passwordValues.currentPassword) {
      nextErrors.currentPassword = "Please enter your current password";
    }

    if (!passwordValues.newPassword) {
      nextErrors.newPassword = "Please enter a new password";
    } else if (passwordValues.newPassword.length < 8) {
      nextErrors.newPassword = "Password must be at least 8 characters long";
    } else if (
      passwordValues.newPassword === passwordValues.currentPassword
    ) {
      nextErrors.newPassword =
        "New password must be different from the current password";
    }

    if (!passwordValues.confirmPassword) {
      nextErrors.confirmPassword = "Please re-enter your new password";
    } else if (passwordValues.confirmPassword !== passwordValues.newPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setPasswordStatus(
        "Password updated! Replace this handler with your backend integration.",
      );
      setPasswordValues(PASSWORD_DEFAULTS);
    } else {
      setPasswordStatus(null);
    }
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file (PNG, JPG, or SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
        setAvatarError(null);
        setAvatarStatus(
          `Preview ready. Click "Save avatar" to apply ${file.name}.`,
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarReset = () => {
    setAvatarPreview(profile.avatarUrl);
    setAvatarError(null);
    setAvatarStatus("Avatar preview reset.");
  };

  const handleAvatarSave = () => {
    if (!avatarPreview) {
      setAvatarError("Please choose an image before saving.");
      return;
    }

    setProfile((previous) => ({
      ...previous,
      avatarUrl: avatarPreview,
    }));
    setAvatarStatus(
      "Avatar updated! Replace this handler with your backend integration.",
    );
  };

  return (
    <>
      <Page.Header>
        <div className="container-xl">

          <Page.Title>
            Account settings
          </Page.Title>
          <Page.Subtitle>
            Manage your contact info, avatar, and password in one place.
          </Page.Subtitle>
        </div >
      </Page.Header>
      <Page.Body>
        <div className="container-xl" >

          <Card className=" mb-4">
            <Card.Header>
              <Card.Title
                subtitle="Upload a clear photo so teammates can recognize you across the dashboard."
                className="mb-0">Profile photo</Card.Title>

            </Card.Header>
            <Card.Body className="d-grid gap-3">
              <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                <Avatar size="xl" src={avatarPreview} className="avatar-xl" />
                <div className="flex-fill w-100">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-2"
                    onChange={handleAvatarChange}
                  />
                  <div className="d-flex flex-wrap gap-2">
                    <Button color="primary" size="sm" onClick={handleAvatarSave}>
                      Save avatar
                    </Button>
                    <Button
                      color="secondary"
                      size="sm"
                      variant="outline"
                      onClick={handleAvatarReset}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
              {avatarStatus ? (
                <Text className="text-success small mb-0">{avatarStatus}</Text>
              ) : null}
              {avatarError ? (
                <Text className="text-danger small mb-0">{avatarError}</Text>
              ) : null}
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <Card.Title subtitle={appearanceHint} className="mb-0">Profile information</Card.Title>

            </Card.Header>
            <Card.Body>
              <form className="row g-3" onSubmit={handleProfileSubmit} noValidate>
                <div className="col-12 col-md-6">
                  <FormTextInput
                    name="fullName"
                    label="Full name *"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    error={profileErrors.fullName}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <FormTextInput
                    name="jobTitle"
                    label="Role / Title *"
                    value={profile.jobTitle}
                    onChange={handleProfileChange}
                    error={profileErrors.jobTitle}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <FormTextInput
                    name="email"
                    type="email"
                    label="Email *"
                    value={profile.email}
                    onChange={handleProfileChange}
                    error={profileErrors.email}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <FormTextInput
                    name="department"
                    label="Department *"
                    value={profile.department}
                    onChange={handleProfileChange}
                    error={profileErrors.department}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <FormTextInput
                    name="phone"
                    label="Phone number *"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    error={profileErrors.phone}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <FormTextInput
                    name="location"
                    label="Location *"
                    value={profile.location}
                    onChange={handleProfileChange}
                    error={profileErrors.location}
                  />
                </div>

                <div className="col-12">
                  <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center">
                    <Button type="submit" color="primary">
                      Save changes
                    </Button>
                    {profileStatus ? (
                      <Text className="text-success small mb-0">{profileStatus}</Text>
                    ) : null}
                  </div>
                </div>
              </form>
            </Card.Body>
          </Card>

          <Card className=" mb-4">
            <Card.Header>
              <Card.Title subtitle=" Use a strong password that you do not reuse anywhere else." className="mb-0">Change password</Card.Title>

            </Card.Header>
            <Card.Body>
              <form className="d-grid gap-3" onSubmit={handlePasswordSubmit} noValidate>
                <FormTextInput
                  name="currentPassword"
                  type="password"
                  label="Current password"
                  placeholder="Enter your current password"
                  value={passwordValues.currentPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.currentPassword}
                  autoComplete="current-password"
                />
                <FormTextInput
                  name="newPassword"
                  type="password"
                  label="New password"
                  placeholder="Choose a new password"
                  value={passwordValues.newPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.newPassword}
                  autoComplete="new-password"
                />
                <FormTextInput
                  name="confirmPassword"
                  type="password"
                  label="Confirm new password"
                  placeholder="Re-enter your new password"
                  value={passwordValues.confirmPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.confirmPassword}
                  autoComplete="new-password"
                />
                <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center">
                  <Button type="submit" color="primary">
                    Update password
                  </Button>
                  {passwordStatus ? (
                    <Text className="text-success small mb-0">
                      {passwordStatus}
                    </Text>
                  ) : null}
                </div>
              </form>
            </Card.Body>
          </Card>

        </div >
      </Page.Body>
    </>


  );
}

export default AccountSettingsPage;
