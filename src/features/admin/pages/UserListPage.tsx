import { Button, Modal, Text } from "tabler-react-ui";
import { IconRefresh, IconUserPlus, IconUsersGroup } from "@tabler/icons-react";

import { UserBulkUploadForm } from "../components/UserBulkUploadForm";
import { UserAddForm } from "../components/UserAddForm";
import { UserTable } from "../components/UserTable";
import { useAdminUsers } from "../hooks/useAdminUsers";
import type { BulkCreateAdminUserInput, BulkCreateAdminUsersResult, CreateAdminUserInput } from "../types";
import { useModal } from "@/components/common/ModalProvider";

export function UserListPage() {
  const { users, loading, error, refresh, toggleStatus } = useAdminUsers();
  const { showModal } = useModal();
  const handleAddUserSuccess = async (_payload: CreateAdminUserInput) => {
    await refresh();
  };
  const handleBulkCreate = async (_entries: BulkCreateAdminUserInput[]): Promise<BulkCreateAdminUsersResult> => {
    throw new Error("Bulk upload is not supported with the current API.");
  };
  const openAddUserModal = () => {
    showModal({
      header: (
        <Modal.Header>
          <Modal.Title>Add a user</Modal.Title>
        </Modal.Header>
      ),
      body: ({ close }) => (
        <Modal.Body>
          <UserAddForm onAddUser={handleAddUserSuccess} onCancel={close} variant="modal" />
        </Modal.Body>
      ),
      modalProps: {
        centered: true,
        scrollable: true,
        size: "lg",
      },
    });
  };
  const openBulkAddModal = () => {
    showModal({
      header: (
        <Modal.Header>
          <Modal.Title>Bulk add users</Modal.Title>
        </Modal.Header>
      ),
      body: ({ close }) => (
        <Modal.Body>
          <UserBulkUploadForm onBulkCreate={handleBulkCreate} onCancel={close} variant="modal" />
        </Modal.Body>
      ),
      modalProps: {
        centered: true,
        scrollable: true,
        size: "lg",
      },
    });
  };

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
            <Button
              color="primary"
              onClick={() => openAddUserModal()}
            >
              <IconUserPlus size={16} className="me-1" />
              Add user
            </Button>
            <Button
              variant="light"
              color="primary"
              onClick={() => openBulkAddModal()}
            >
              <IconUsersGroup size={16} className="me-1" />
              Bulk add users
            </Button>
            <Button variant="light" color="secondary" onClick={() => refresh()} disabled={loading}>
              <IconRefresh size={16} className="me-1" />
              Refresh
            </Button>
          </div>
        </div>

        <UserTable users={users} loading={loading} error={error} onToggleStatus={toggleStatus} />
      </div>
    </div>
  );
}

export default UserListPage;
