import { Form } from "tabler-react-ui";
import type { RoleRead } from "@/client";

const ROLE_OPTIONS: Array<{ value: RoleRead["name"]; label: string; }> = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "user", label: "User" },
];

interface UserTableFiltersProps {
  query: string;
  roleFilter: "all" | RoleRead["name"];
  statusFilter: "all" | "active" | "inactive";
  onQueryChange: (query: string) => void;
  onRoleChange: (role: "all" | RoleRead["name"]) => void;
  onStatusChange: (status: "all" | "active" | "inactive") => void;
  disabled?: boolean;
}

/**
 * User table filters component
 */
export function UserTableFilters({
  query,
  roleFilter,
  statusFilter,
  onQueryChange,
  onRoleChange,
  onStatusChange,
  disabled = false,
}: UserTableFiltersProps) {
  return (
    <div className="row g-3 mt-1">
      <div className="col-12 col-md-6 col-lg-4">
        <Form.Input
          label="Search"
          placeholder="Search by name or email"
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          disabled={disabled}
        />
      </div>
      <div className="col-6 col-md-3 col-lg-2">
        <Form.Select
          label="Role"
          value={roleFilter}
          onChange={(event) => onRoleChange(event.currentTarget.value as typeof roleFilter)}
          disabled={disabled}
        >
          <option value="all">All</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </Form.Select>
      </div>
      <div className="col-6 col-md-3 col-lg-2">
        <Form.Select
          label="Status"
          value={statusFilter}
          onChange={(event) => onStatusChange(event.currentTarget.value as typeof statusFilter)}
          disabled={disabled}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Form.Select>
      </div>
    </div>
  );
}
