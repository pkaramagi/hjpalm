import { useCallback } from "react";
import { Modal } from "tabler-react-ui";
import type { UserRead } from "@/client";
import { useModal } from "@/components/common/ModalProvider";
import { UserAddForm } from "../components/UserAddForm";
import { UserEditForm } from "../components/UserEditForm";
import { UserBulkUploadForm } from "../components/UserBulkUploadForm";
import type {
  BulkCreateAdminUserInput,
  BulkCreateAdminUsersResult,
  CreateAdminUserInput,
} from "../types";

interface UseUserModalsOptions {
  onAddUserSuccess?: (payload: CreateAdminUserInput) => void | Promise<void>;
  onEditSuccess?: () => void | Promise<void>;
  onBulkCreate?: (entries: BulkCreateAdminUserInput[]) => Promise<BulkCreateAdminUsersResult>;
}

/**
 * Custom hook to manage user-related modals
 */
export function useUserModals({
  onAddUserSuccess,
  onEditSuccess,
  onBulkCreate,
}: UseUserModalsOptions = {}) {
  const { showModal } = useModal();

  const openAddUserModal = useCallback(() => {
    showModal({
      header: (
        <Modal.Header>
          <Modal.Title>Add a user</Modal.Title>
        </Modal.Header>
      ),
      body: ({ close }) => (
        <Modal.Body>
          <UserAddForm
            onAddUser={async (payload) => {
              await onAddUserSuccess?.(payload);
              close();
            }}
            onCancel={close}
            variant="modal"
          />
        </Modal.Body>
      ),
      modalProps: {
        centered: true,
        scrollable: true,
        size: "lg",
      },
    });
  }, [showModal, onAddUserSuccess]);

  const openEditUserModal = useCallback(
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
              onSuccess={async () => {
                await onEditSuccess?.();
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
    [showModal, onEditSuccess],
  );

  const openBulkAddModal = useCallback(() => {
    const handleBulkCreate =
      onBulkCreate ??
      (async () => {
        throw new Error("Bulk upload is not supported with the current API.");
      });

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
  }, [showModal, onBulkCreate]);

  return {
    openAddUserModal,
    openEditUserModal,
    openBulkAddModal,
  };
}
