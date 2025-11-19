import type { AdminUserRole } from "../types";

export const ADMIN_ROLE_OPTIONS: Array<{
  value: AdminUserRole;
  label: string;
  helper: string;
}> = [
  {
    value: "admin",
    label: "Administrator",
    helper: "Full access to every module, including security settings.",
  },
  {
    value: "manager",
    label: "Manager",
    helper: "Manage teams, approve requests, and view sensitive records.",
  },
  {
    value: "staff",
    label: "Staff",
    helper: "Edit their own ministry data and submit updates for review.",
  },
  {
    value: "viewer",
    label: "Viewer",
    helper: "Read-only access to shared dashboards.",
  },
];
