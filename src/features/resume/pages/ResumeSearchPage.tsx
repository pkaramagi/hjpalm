import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  DataTable,
  Form,
  Text,
} from "tabler-react-ui";
import { IconSearch } from "@tabler/icons-react";

import { useResumeRecords } from "@/features/resume/hooks/useResumeRecords";
import { useResumeFilters } from "@/features/resume/hooks/useResumeFilters";
import { useResumeTableData } from "@/features/resume/hooks/useResumeTableData";
import { SimpleFiltersComponent } from "@/features/resume/components/filters/SimpleFilters";
import { AdvancedFiltersComponent } from "@/features/resume/components/filters/AdvancedFilters";
import { createResumeTableColumns } from "@/features/resume/components/table/ResumeTableColumns";

export function ResumeSearchPage() {
  const navigate = useNavigate();
  const { records, loading, error, reload } = useResumeRecords();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    simpleFilters,
    advancedFilters,
    updateSimpleFilter,
    updateAdvancedFilter,
    setAdvancedFilters,
    resetAllFilters,
    hasActiveAdvancedFilters,
    filteredRecords,
    departmentOptions,
    trainingCategories,
  } = useResumeFilters(records);

  const tableRows = useResumeTableData(filteredRecords);

  const columns = useMemo(
    () => createResumeTableColumns((profileId) => navigate(`/resume/${profileId}/view`)),
    [navigate]
  );

  const headerDescription = useMemo(() => {
    if (loading) {
      return "Loading resumes...";
    }
    if (error) {
      return "Unable to fetch resumes. Please retry.";
    }
    return `${filteredRecords.length} resume(s) available.`;
  }, [loading, error, filteredRecords.length]);

  return (
    <div className="container-xl">
      <div className="page-header d-print-none">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Resume Search</h2>
            <div className="text-secondary">{headerDescription}</div>
          </div>
          <div className="col-auto">
            {hasActiveAdvancedFilters ? (
              <Badge color="primary" size="lg">
                Advanced filters active
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form
            className="mt-2"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <SimpleFiltersComponent
              filters={simpleFilters}
              departmentOptions={departmentOptions}
              onFilterChange={updateSimpleFilter}
              onReset={resetAllFilters}
              onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
              showAdvanced={showAdvanced}
            />
          </Form>
        </Card.Body>
      </Card>

      {showAdvanced ? (
        <AdvancedFiltersComponent
          filters={advancedFilters}
          trainingCategories={trainingCategories}
          onFilterChange={updateAdvancedFilter}
          onSetFilters={setAdvancedFilters}
        />
      ) : null}

      {error ? (
        <Alert color="red" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error.message}</span>
            <Button size="sm" variant="light" onClick={reload}>
              Retry
            </Button>
          </div>
        </Alert>
      ) : null}

      {loading ? (
        <Card>
          <Card.Body className="text-center py-5">
            <Text muted>Loading resumes...</Text>
          </Card.Body>
        </Card>
      ) : filteredRecords.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <IconSearch size={48} className="text-secondary mb-3" />
            <h3>No results found</h3>
            <p className="text-secondary mb-3">
              Try broadening your search or resetting the filters.
            </p>
            <Button variant="light" onClick={resetAllFilters}>
              Reset filters
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <DataTable
              data={tableRows}
              columns={columns}
              pageSize={8}
              showEntries
              showNavigation
            />
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
