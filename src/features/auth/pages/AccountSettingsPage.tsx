import { useState } from "react";
import { Page } from "tabler-react-ui";

import { ProfilePhotoCard } from "@/features/auth/components/ProfilePhotoCard";
import { ProfileInformationCard } from "@/features/auth/components/ProfileInformationCard";
import { ChangePasswordCard } from "@/features/auth/components/ChangePasswordCard";
import type { ProfileFormFields } from "@/features/auth/hooks/useProfileForm";
import type { PasswordFormFields } from "@/features/auth/hooks/usePasswordForm";

const INITIAL_PROFILE: ProfileFormFields = {
  fullName: "Jane Doe",
  email: "jane.doe@example.com",
  department: "Global Missions",
  phone: "+82 10-0000-0000",
  location: "Seoul, South Korea",
  jobTitle: "UPA Regional Coordinator",
};

const INITIAL_AVATAR_URL = "https://preview.tabler.io/static/avatars/000m.jpg";

export function AccountSettingsPage() {
  const [profile, setProfile] = useState<ProfileFormFields>(INITIAL_PROFILE);
  const [avatarUrl, setAvatarUrl] = useState(INITIAL_AVATAR_URL);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  const handleProfileSubmit = (values: ProfileFormFields) => {
    setProfile(values);
    setProfileStatus(
      "Profile updated! Replace this handler with your backend integration."
    );
  };

  const handlePasswordSubmit = (values: PasswordFormFields) => {
    console.log("Password change values:", values);
    setPasswordStatus(
      "Password updated! Replace this handler with your backend integration."
    );
  };

  const handlePhotoSave = (photoUrl: string) => {
    setAvatarUrl(photoUrl);
  };

  return (
    <>
      <Page.Header>
        <div className="container-xl">
          <Page.Title>Account settings</Page.Title>
          <Page.Subtitle>
            Manage your contact info, avatar, and password in one place.
          </Page.Subtitle>
        </div>
      </Page.Header>
      <Page.Body>
        <div className="container-xl">
          <ProfilePhotoCard
            currentPhotoUrl={avatarUrl}
            onPhotoSave={handlePhotoSave}
          />

          <ProfileInformationCard
            initialValues={profile}
            onSubmit={handleProfileSubmit}
            statusMessage={profileStatus}
          />

          <ChangePasswordCard
            onSubmit={handlePasswordSubmit}
            statusMessage={passwordStatus}
          />
        </div>
      </Page.Body>
    </>
  );
}

export default AccountSettingsPage;
