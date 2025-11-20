import { Button, Text } from "tabler-react-ui";
import { IconRefresh, IconUserPlus, IconUsersGroup } from "@tabler/icons-react";

import { UserTable } from "../components/UserTable";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { useUserModals } from "../hooks/useUserModals";

export function UserListPage() {
  const { users, loading, error, refresh, toggleStatus } = useAdminUsers();

  const { openAddUserModal, openEditUserModal, openBulkAddModal } = useUserModals({
    onAddUserSuccess: async () => {
      await refresh();
    },
    onEditSuccess: async () => {
      await refresh();
    },
  });

  return (
    <div className="page-body">
      <div className="container-xl py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
          <div>
            <h2 className="mb-1">Manage application users</h2>
            <Text muted size="sm">
              Add teammates, bulk provision accounts, and reset passwords for the UPA apps.
            </Text>
          </div>
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">
            <Button color="primary" onClick={openAddUserModal}>
              <IconUserPlus size={16} className="me-1" />
              Add user
            </Button>
            <Button variant="light" color="primary" onClick={openBulkAddModal}>
              <IconUsersGroup size={16} className="me-1" />
              Bulk add users
            </Button>
            <Button variant="light" color="secondary" onClick={() => refresh()} disabled={loading}>
              <IconRefresh size={16} className="me-1" />
              Refresh
            </Button>
          </div>
        </div>

        <UserTable
          users={users}
          loading={loading}
          error={error}
          onToggleStatus={toggleStatus}
          onEdit={openEditUserModal}
        />
      </div>
    </div>
  );
}

export default UserListPage;
