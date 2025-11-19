import { Form, Grid, Button } from "tabler-react-ui";
import { IconSearch } from "@tabler/icons-react";
import type { SimpleFilters } from "../../hooks/useResumeFilters";

interface SimpleFiltersProps {
  filters: SimpleFilters;
  departmentOptions: string[];
  onFilterChange: (key: keyof SimpleFilters) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onReset: () => void;
  onToggleAdvanced: () => void;
  showAdvanced: boolean;
}

export function SimpleFiltersComponent({
  filters,
  departmentOptions,
  onFilterChange,
  onReset,
  onToggleAdvanced,
  showAdvanced,
}: SimpleFiltersProps) {
  return (
    <>
      <Grid.Row className="g-3">
        <Grid.Col md={6}>
          <Form.Input
            label="Quick search"
            placeholder="Name, department, school, company..."
            icon={<IconSearch size={16} />}
            value={filters.query}
            onChange={onFilterChange("query")}
          />
        </Grid.Col>
        <Grid.Col md={3}>
          <Form.Select
            label="Department"
            value={filters.department}
            onChange={onFilterChange("department")}
          >
            <option value="all">All departments</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </Form.Select>
        </Grid.Col>
        <Grid.Col md={3} className="d-flex gap-2 justify-content-md-end">
          <Button variant="light" color="secondary" onClick={onReset}>
            Reset
          </Button>
          <Button
            variant="light"
            color="primary"
            onClick={onToggleAdvanced}
          >
            <IconSearch size={16} className="me-1" />
            {showAdvanced ? "Hide advanced" : "Advanced"}
          </Button>
        </Grid.Col>
      </Grid.Row>

      <Grid.Row className="g-3 mt-1">
        <Grid.Col md={3}>
          <Form.Input
            label="Position"
            value={filters.position}
            onChange={onFilterChange("position")}
          />
        </Grid.Col>
        <Grid.Col md={3}>
          <Form.Input
            label="Rank"
            value={filters.rank}
            onChange={onFilterChange("rank")}
          />
        </Grid.Col>
      </Grid.Row>
    </>
  );
}
