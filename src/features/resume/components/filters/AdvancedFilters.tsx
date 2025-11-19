import { Card, Form, Grid, Text } from "tabler-react-ui";
import type { AdvancedFilters } from "../../hooks/useResumeFilters";
import type { DegreeType } from "../../types/resume";

interface AdvancedFiltersProps {
  filters: AdvancedFilters;
  trainingCategories: string[];
  onFilterChange: (key: keyof AdvancedFilters) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSetFilters: React.Dispatch<React.SetStateAction<AdvancedFilters>>;
}

export function AdvancedFiltersComponent({
  filters,
  trainingCategories,
  onFilterChange,
  onSetFilters,
}: AdvancedFiltersProps) {
  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title>Advanced filters</Card.Title>
        <Text size="sm" className="text-secondary mb-0">
          Combine education, work, training, and qualification filters.
        </Text>
      </Card.Header>
      <Card.Body>
        <Grid.Row className="g-3">
          <Grid.Col md={4}>
            <Form.Input
              label="School"
              value={filters.school}
              onChange={onFilterChange("school")}
              placeholder="Example: Seoul National University"
            />
          </Grid.Col>
          <Grid.Col md={4}>
            <Form.Select
              label="Degree"
              value={filters.degree}
              onChange={(event) => {
                const { value } = event.currentTarget;
                onSetFilters((prev) => ({
                  ...prev,
                  degree: value as DegreeType | "",
                }));
              }}
            >
              <option value="">All</option>
              <option value="bachelor">Bachelor</option>
              <option value="master">Master</option>
              <option value="doctorate">Doctorate</option>
              <option value="other">Other</option>
            </Form.Select>
          </Grid.Col>
          <Grid.Col md={4}>
            <Form.Input
              label="Training category"
              value={filters.trainingCategory}
              onChange={onFilterChange("trainingCategory")}
              list="training-categories"
              placeholder="Leadership, Technical..."
            />
            <datalist id="training-categories">
              {trainingCategories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </Grid.Col>

          <Grid.Col md={4}>
            <Form.Input
              label="Company"
              value={filters.company}
              onChange={onFilterChange("company")}
            />
          </Grid.Col>
          <Grid.Col md={4}>
            <Form.Input
              label="Work role"
              value={filters.workRole}
              onChange={onFilterChange("workRole")}
              placeholder="Department or title"
            />
          </Grid.Col>
          <Grid.Col md={4}>
            <Form.Input
              label="Church position"
              value={filters.churchRole}
              onChange={onFilterChange("churchRole")}
            />
          </Grid.Col>

          <Grid.Col md={4}>
            <Form.Input
              label="Qualification"
              value={filters.qualification}
              onChange={onFilterChange("qualification")}
            />
          </Grid.Col>
          <Grid.Col md={4}>
            <Form.Input
              label="Award"
              value={filters.award}
              onChange={onFilterChange("award")}
            />
          </Grid.Col>
          <Grid.Col md={4}>
            <div className="d-flex flex-column gap-2">
              <Form.Checkbox
                label="Only show candidates with profile photos"
                checked={filters.withPhoto}
                onChange={(event) =>
                  onSetFilters((prev) => ({
                    ...prev,
                    withPhoto: event.currentTarget.checked,
                  }))
                }
              />
              <Form.Checkbox
                label="Only show currently employed (no end date)"
                checked={filters.currentlyEmployed}
                onChange={(event) =>
                  onSetFilters((prev) => ({
                    ...prev,
                    currentlyEmployed: event.currentTarget.checked,
                  }))
                }
              />
            </div>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
    </Card>
  );
}
