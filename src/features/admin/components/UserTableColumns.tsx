import { useMemo, useCallback } from "react";
import { Avatar, Badge, Button, Text } from "tabler-react-ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { UserRead } from "@/client";
import { formatDate, getUserInitials, getUserDisplayName } from "../utils/formatters";

const STATUS_META: Record<"active" | "inactive", { color: string; label: string; }> = {
  active: { color: "green", label: "Active" },
  inactive: { color: "gray", label: "Inactive" },
};

interface CreateUserTableColumnsOptions {
  onToggleStatus: (user: UserRead) => void;
  onEdit: (user: UserRead) => void;
  onViewResume?: (user: UserRead) => void;
  onDelete?: (user: UserRead) => void;
  togglingUserId: string | null;
}

/**
 * Factory function to create user table column definitions
 */
export function createUserTableColumns({
  onToggleStatus,
  onEdit,
  onViewResume,
  onDelete,
  togglingUserId,
}: CreateUserTableColumnsOptions): ColumnDef<UserRead>[] {
  return [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="d-flex align-items-center gap-2">
            <Avatar color="blue" size="sm">
              {getUserInitials(user)}
            </Avatar>
            <div className="d-flex flex-column">
              <strong>{getUserDisplayName(user)}</strong>
              <Text muted size="xs">
                {user.email}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      header: "Username",
      accessorKey: "username",
      cell: ({ row }) => <Text size="sm">{row.original.username}</Text>,
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => <span className="text-capitalize">{row.original.role?.name ?? "user"}</span>,
    },
    {
      header: "Last access",
      accessorKey: "last_login",
      cell: ({ row }) => formatDate(row.original.last_login ?? null),
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: ({ row }) => {
        const key = row.original.is_active ? "active" : "inactive";
        const meta = STATUS_META[key];
        return (
          <Badge color={meta.color} variant="light">
            {meta.label}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="d-flex flex-column flex-xxl-row justify-content-end gap-2">
          <div className="btn-group">
            <Button
              size="sm"
              variant="light"
              color="primary"
              onClick={() => onViewResume?.(row.original)}
              disabled={!onViewResume}
            >
              View resume
            </Button>
            <Button
              size="sm"
              variant="light"
              color="secondary"
              onClick={() => onEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="light"
              color="danger"
              onClick={() => onDelete?.(row.original)}
              disabled={!onDelete}
            >
              Delete
            </Button>
          </div>
          <Button
            size="sm"
            variant="light"
            color={row.original.is_active ? "warning" : "primary"}
            onClick={() => onToggleStatus(row.original)}
            disabled={togglingUserId === row.original.id}
          >
            {togglingUserId === row.original.id
              ? "Updating..."
              : row.original.is_active
                ? "Deactivate"
                : "Activate"}
          </Button>
        </div>
      ),
    },
  ];
}
