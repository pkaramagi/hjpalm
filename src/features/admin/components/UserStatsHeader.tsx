import { Badge, Card, Text } from "tabler-react-ui";

interface UserStatsHeaderProps {
  total: number;
  active: number;
  inactive: number;
}

/**
 * User statistics header component
 */
export function UserStatsHeader({ total, active, inactive }: UserStatsHeaderProps) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
      <div>
        <Card.Title className="mb-1">Directory</Card.Title>
        <Text muted size="sm">
          {total} users · {active} active · {inactive} inactive
        </Text>
      </div>
      <div className="d-flex flex-wrap gap-2">
        <Badge color="green" variant="light">
          Active {active}
        </Badge>
        <Badge color="gray" variant="light">
          Inactive {inactive}
        </Badge>
      </div>
    </div>
  );
}
