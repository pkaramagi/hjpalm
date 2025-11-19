import { Card, Text } from "tabler-react-ui";
import {
  IconChecklist,
  IconBooks,
  IconEye,
  IconSearch,
} from "@tabler/icons-react";
import type { ResumeStats } from "../../hooks/useResumeStats";

interface ResumeStatsCardProps {
  stats: ResumeStats;
}

export function ResumeStatsCard({ stats }: ResumeStatsCardProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Resume health</Card.Title>
        <Text muted size="sm">
          High-level metrics from stored profiles.
        </Text>
      </Card.Header>
      <Card.Body>
        <div className="d-grid gap-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Text size="lg" className="mb-0">
                {stats.total}
              </Text>
              <Text muted size="sm">
                Total resumes
              </Text>
            </div>
            <IconChecklist size={28} className="text-secondary" />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Text size="lg" className="mb-0">
                {stats.departments}
              </Text>
              <Text muted size="sm">
                Represented departments
              </Text>
            </div>
            <IconBooks size={28} className="text-secondary" />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Text size="lg" className="mb-0">
                {stats.withPhoto}
              </Text>
              <Text muted size="sm">
                Profiles with photos
              </Text>
            </div>
            <IconEye size={28} className="text-secondary" />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Text size="lg" className="mb-0">
                {stats.withEmail}
              </Text>
              <Text muted size="sm">
                Reachable via email
              </Text>
            </div>
            <IconSearch size={28} className="text-secondary" />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
