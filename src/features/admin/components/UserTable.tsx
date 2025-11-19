import { useCallback, useMemo, useState } from "react";
import { Avatar, Badge, Button, Card, DataTable, Form, Modal, Text } from "tabler-react-ui";
import type { ColumnDef } from "@tanstack/react-table";

import type { RoleRead, UserRead } from "@/client";
import { useModal } from "@/components/common/ModalProvider";
import { UserEditForm } from "./UserEditForm";

type UserTableProps = {
  users: UserRead[];
  loading: boolean;
  error?: Error | null;
  onToggleStatus: (userId: string, nextActive: boolean) => Promise<void>;
  onViewResume?: (user: UserRead) => void;
  onEdit?: (user: UserRead) => void;
  onDelete?: (user: UserRead) => void;
};

const STATUS_META: Record<"active" | "inactive", { color: string; label: string; }> = {
  active: { color: "green", label: "Active" },
  inactive: { color: "gray", label: "Inactive" },
};

const ROLE_OPTIONS: Array<{ value: RoleRead["name"]; label: string; }> = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "user", label: "User" },
];

const formatDate = (iso?: Date | string | null) => {
  if (!iso) return "Never";
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (user: UserRead) => {
  const source = user.name || user.email || user.username;
  if (!source) return "U";
  return source
    .trim()
    .split(/\s+/)
    .map((segment) => segment[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function UserTable({
  users,
  loading,
  error,
  onToggleStatus,
  onViewResume,
  onEdit,
  onDelete,
}: UserTableProps) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | RoleRead["name"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const { showModal } = useModal();

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        needle.length === 0 ||
        [user.name ?? "", user.email ?? "", user.username ?? "", user.role?.name ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesRole = roleFilter === "all" || user.role?.name === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? user.is_active : !user.is_active);
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [query, roleFilter, statusFilter, users]);

  const stats = useMemo(() => {
    const active = users.filter((user) => user.is_active).length;
    const inactive = users.length - active;
    return { total: users.length, active, inactive };
  }, [users]);

  const handleToggleStatus = useCallback(
    async (user: UserRead) => {
      setStatusMessage(null);
      setTogglingUserId(user.id);
      try {
        await onToggleStatus(user.id, !user.is_active);
        setStatusMessage({
          type: "success",
          message: `${user.name ?? user.email ?? user.username} is now ${user.is_active ? "inactive" : "active"}.`,
        });
      } catch (err) {
        setStatusMessage({
          type: "error",
          message: err instanceof Error ? err.message : "Could not update user status.",
        });
      } finally {
        setTogglingUserId(null);
      }
    },
    [onToggleStatus],
  );

  const showDefaultEditModal = useCallback(
    (user: UserRead) => {
      showModal({
        header: (
          <Modal.Header>
            <Modal.Title>Edit {user.name ?? user.email ?? user.username}</Modal.Title>
          </Modal.Header>
        ),
        body: ({ close }) => (
          <Modal.Body>
            <UserEditForm
              user={user}
              onSuccess={() => {
                close();
              }}
              onCancel={close}
            />
          </Modal.Body>
        ),
        modalProps: {
          centered: true,
        },
      });
    },
    [showModal],
  );

  const columns = useMemo<ColumnDef<UserRead>[]>(() => [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="d-flex align-items-center gap-2">
            <Avatar color="blue" size="sm">
              {getInitials(user)}
            </Avatar>
            <div className="d-flex flex-column">
              <strong>{user.name ?? user.username ?? user.email}</strong>
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
              onClick={() => {
                if (onEdit) {
                  onEdit(row.original);
                } else {
                  showDefaultEditModal(row.original);
                }
              }}
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
            onClick={() => handleToggleStatus(row.original)}
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
  ], [handleToggleStatus, onDelete, onEdit, onViewResume, showDefaultEditModal, togglingUserId]);

  return (
    <Card>
      <Card.Header>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <Card.Title className="mb-1">Directory</Card.Title>
            <Text muted size="sm">
              {stats.total} users · {stats.active} active · {stats.inactive} inactive
            </Text>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Badge color="green" variant="light">
              Active {stats.active}
            </Badge>
            <Badge color="gray" variant="light">
              Inactive {stats.inactive}
            </Badge>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="pt-0">
        {statusMessage ? (
          <div className={`alert alert-${statusMessage.type === "success" ? "success" : "danger"} mt-3`} role="alert">
            {statusMessage.message}
          </div>
        ) : null}
        {error ? (
          <div className="alert alert-danger mt-3" role="alert">
            {error.message}
          </div>
        ) : null}
        <div className="row g-3 mt-1">
          <div className="col-12 col-md-6 col-lg-4">
            <Form.Input
              label="Search"
              placeholder="Search by name or email"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              disabled={loading}
            />
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <Form.Select
              label="Role"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.currentTarget.value as typeof roleFilter)}
              disabled={loading}
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
              onChange={(event) => setStatusFilter(event.currentTarget.value as typeof statusFilter)}
              disabled={loading}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <Text muted>Loading users...</Text>
          ) : filteredUsers.length === 0 ? (
            <Text muted>No users match the current filters.</Text>
          ) : (
            <DataTable
              data={filteredUsers}
              columns={columns}
              pageSize={8}
              showEntries
              showNavigation
              className="table-vcenter"
            />
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default UserTable;
