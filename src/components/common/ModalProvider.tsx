import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Modal } from "tabler-react-ui";

type ModalRendererProps = { close: () => void; id: number; };
type ModalSectionRenderer = (props: ModalRendererProps) => ReactNode;
type ModalSection = ReactNode | ModalSectionRenderer;
type ModalProps = Omit<ComponentProps<typeof Modal>, "visible" | "onHide">;

type ModalOptions = {
  header?: ModalSection;
  body?: ModalSection;
  footer?: ModalSection;
  modalProps?: ModalProps;
};

type ModalInstance = ModalOptions & { id: number; };

type ModalContextValue = {
  showModal: (options: ModalOptions) => () => void;
  closeAll: () => void;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

const renderSection = (section: ModalSection | undefined, helpers: ModalRendererProps) => {
  if (!section) return null;
  return typeof section === "function" ? (section as ModalSectionRenderer)(helpers) : section;
};

export function ModalProvider({ children }: PropsWithChildren) {
  const idRef = useRef(0);
  const [modals, setModals] = useState<ModalInstance[]>([]);

  const closeModal = useCallback((id: number) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeAll = useCallback(() => {
    setModals([]);
  }, []);

  const showModal = useCallback(
    (options: ModalOptions) => {
      const id = ++idRef.current;
      setModals((prev) => [...prev, { ...options, id }]);
      return () => closeModal(id);
    },
    [closeModal],
  );

  const contextValue = useMemo(
    () => ({
      showModal,
      closeAll,
    }),
    [showModal, closeAll],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modals.map((modal) => {
        const handleClose = () => closeModal(modal.id);
        const helpers = { close: handleClose, id: modal.id };
        return (
          <Modal className="modal-blur fade show" key={modal.id} visible onHide={handleClose} {...modal.modalProps}>
            {renderSection(modal.header, helpers)}
            {renderSection(modal.body, helpers)}
            {renderSection(modal.footer, helpers)}
          </Modal>
        );
      })}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
