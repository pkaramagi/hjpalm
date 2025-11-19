import { Link } from "react-router-dom";
import { Alert, Avatar, Badge, Button, Card, List, Text } from "tabler-react-ui";
import { IconUpload } from "@tabler/icons-react";
import type { ResumeRecordWithId } from "../../api/resumeApi";
import { formatDisplayName, getInitials } from "../../utils/formatters";

interface RecentResumesListProps {
  records: ResumeRecordWithId[];
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export function RecentResumesList({
  records,
  loading,
  error,
  onRetry,
}: RecentResumesListProps) {
  return (
    <Card>
      <Card.Header className="d-flex align-items-center justify-content-between">
        <div>
          <Card.Title className="mb-1">Recent resumes</Card.Title>
          <Text muted size="sm">
            The latest records you can continue editing.
          </Text>
        </div>
        <Link to="/resume/search" className="text-decoration-none">
          <Button variant="light" size="sm">
            Open search
          </Button>
        </Link>
      </Card.Header>
      <Card.Body>
        {error ? (
          <Alert color="red">
            <div className="d-flex justify-content-between align-items-center">
              <span>{error.message}</span>
              <Button size="xs" variant="light" onClick={onRetry}>
                Retry
              </Button>
            </div>
          </Alert>
        ) : null}

        {loading ? (
          <div className="text-center py-4">
            <Text muted>Loading recent activity…</Text>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <IconUpload size={36} className="mb-2" />
            <p className="mb-1 fw-semibold">No resumes yet</p>
            <p className="mb-3">
              Use the builder or import data to start tracking resumes.
            </p>
            <Link to="/resume/add" className="text-decoration-none">
              <Button color="primary">Create resume</Button>
            </Link>
          </div>
        ) : (
          <List>
            {records.map((record) => {
              const profile = record.profile;
              const displayName = formatDisplayName(
                profile.nameKorean,
                profile.firstNameEnglish,
                profile.lastNameEnglish
              );
              const department = profile.department || "Unassigned department";

              return (
                <List.Item key={record.recordId} className="py-3">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <Avatar size="lg" src={profile.photoUrl}>
                        {!profile.photoUrl ? getInitials(displayName) : null}
                      </Avatar>
                      <div>
                        <div className="fw-semibold">{displayName}</div>
                        <Text muted size="sm">
                          {department}
                        </Text>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Badge
                        color={profile.photoUrl ? "green" : "gray"}
                        variant="light"
                      >
                        {profile.photoUrl ? "With photo" : "No photo"}
                      </Badge>
                      <Link
                        to={`/resume/${record.recordId}/profile`}
                        className="text-decoration-none"
                      >
                        <Button size="xs" variant="light">
                          Continue
                        </Button>
                      </Link>
                    </div>
                  </div>
                </List.Item>
              );
            })}
          </List>
        )}
      </Card.Body>
    </Card>
  );
}
