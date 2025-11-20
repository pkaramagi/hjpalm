import { useCallback, useMemo, useState } from "react";
import { Card, DataTable, Text } from "tabler-react-ui";
import type { UserRead } from "@/client";
import { useUserFilters } from "../hooks/useUserFilters";
import { useUserStats } from "../hooks/useUserStats";
import { UserTableFilters } from "./UserTableFilters";
import { UserStatsHeader } from "./UserStatsHeader";
import { createUserTableColumns } from "./UserTableColumns";
import { getUserDisplayName } from "../utils/formatters";

type UserTableProps = {
  users: UserRead[];
  loading: boolean;
  error?: Error | null;
  onToggleStatus: (userId: string, nextActive: boolean) => Promise<void>;
  onEdit: (user: UserRead) => void;
  onViewResume?: (user: UserRead) => void;
  onDelete?: (user: UserRead) => void;
};

export function UserTable({
  users,
  loading,
  error,
  onToggleStatus,
  onEdit,
  onViewResume,
  onDelete,
}: UserTableProps) {
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  const stats = useUserStats(users);
  const {
    filters,
    filteredUsers,
    setQuery,
    setRoleFilter,
    setStatusFilter,
  } = useUserFilters(users);

  const handleToggleStatus = useCallback(
    async (user: UserRead) => {
      setStatusMessage(null);
      setTogglingUserId(user.id);
      try {
        await onToggleStatus(user.id, !user.is_active);
        setStatusMessage({
          type: "success",
          message: `${getUserDisplayName(user)} is now ${user.is_active ? "inactive" : "active"}.`,
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
    [onToggleStatus]
  );

  const columns = useMemo(
    () =>
      createUserTableColumns({
        onToggleStatus: handleToggleStatus,
        onEdit,
        onViewResume,
        onDelete,
        togglingUserId,
      }),
    [handleToggleStatus, onEdit, onViewResume, onDelete, togglingUserId]
  );

  return (
    <Card>
      <Card.Header>
        <UserStatsHeader total={stats.total} active={stats.active} inactive={stats.inactive} />
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

        <UserTableFilters
          query={filters.query}
          roleFilter={filters.roleFilter}
          statusFilter={filters.statusFilter}
          onQueryChange={setQuery}
          onRoleChange={setRoleFilter}
          onStatusChange={setStatusFilter}
          disabled={loading}
        />

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
