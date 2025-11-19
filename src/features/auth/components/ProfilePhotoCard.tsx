import { useState } from "react";
import { Avatar, Button, Card, Text } from "tabler-react-ui";

interface ProfilePhotoCardProps {
  currentPhotoUrl: string;
  onPhotoSave: (photoUrl: string) => void;
}

export function ProfilePhotoCard({ currentPhotoUrl, onPhotoSave }: ProfilePhotoCardProps) {
  const [avatarPreview, setAvatarPreview] = useState(currentPhotoUrl);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, or SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
        setError(null);
        setStatus(`Preview ready. Click "Save avatar" to apply ${file.name}.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setAvatarPreview(currentPhotoUrl);
    setError(null);
    setStatus("Avatar preview reset.");
  };

  const handleSave = () => {
    if (!avatarPreview) {
      setError("Please choose an image before saving.");
      return;
    }

    onPhotoSave(avatarPreview);
    setStatus("Avatar updated! Replace this handler with your backend integration.");
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title
          subtitle="Upload a clear photo so teammates can recognize you across the dashboard."
          className="mb-0"
        >
          Profile photo
        </Card.Title>
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
              <Button color="primary" size="sm" onClick={handleSave}>
                Save avatar
              </Button>
              <Button
                color="secondary"
                size="sm"
                variant="outline"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
        {status ? (
          <Text className="text-success small mb-0">{status}</Text>
        ) : null}
        {error ? (
          <Text className="text-danger small mb-0">{error}</Text>
        ) : null}
      </Card.Body>
    </Card>
  );
}
