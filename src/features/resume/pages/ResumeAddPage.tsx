import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Badge, Button, Card, DataTable, Form, Modal, Text } from "tabler-react-ui";
import type { ColumnDef } from "@tanstack/react-table";
import { IconFileCv, IconPlus, IconRefresh } from "@tabler/icons-react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { useResumeRecords } from "../hooks/useResumeRecords";
import { useCreateResumeRecord } from "../hooks/useCreateResumeRecord";
import type { ResumeRecordWithId } from "../api/resumeApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Resumes } from "@/client/sdk.gen";
import { useModal } from "@/components/common/ModalProvider";

const createSchema = z.object({
  resumeName: z.string().trim().min(1, "Resume name is required"),
  language: z.enum(["ko", "ja", "en", "pt", "fr", "es", "zh"], {
    errorMap: () => ({ message: "Select a language" }),
  }),
  purpose: z.string().trim().optional(),
});

type FormState = z.infer<typeof createSchema>;

const INITIAL_VALUES: FormState = {
  resumeName: "",
  language: "ko",
  purpose: "",
};

const LANGUAGE_OPTIONS = [
  { value: "ko", label: "Korean" },
  { value: "ja", label: "Japanese" },
  { value: "en", label: "English" },
  { value: "pt", label: "Portuguese" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "zh", label: "Chinese" },
];

export function ResumeAddPage() {
  const navigate = useNavigate();
  const { records, loading, error, reload } = useResumeRecords();
  const { user } = useAuth();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showModal } = useModal();
  const deleteMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      await Resumes.resumesDeleteResume({ path: { resume_id: resumeId } });
    },
    onSuccess: () => {
      setStatusMessage({ type: "success", message: "Resume deleted." });
      reload();
    },
    onError: (err) => {
      setStatusMessage({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to delete resume.",
      });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const columns = useMemo<ColumnDef<ResumeRecordWithId>[]>(
    () => [
      {
        header: "Resume",
        accessorKey: "meta.name",
        cell: ({ row }) => {
          const meta = row.original.meta;
          return (
            <div>
              <strong>{meta.name}</strong>
              <Text muted size="xs">
                {meta.purpose ?? "No purpose set"}
              </Text>
            </div>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "meta.status",
        cell: ({ row }) => (
          <Badge color={row.original.meta.status === "active" ? "green" : "gray"} variant="light">
            {row.original.meta.status ?? "unknown"}
          </Badge>
        ),
      },
      {
        header: "Language",
        accessorKey: "meta.language",
        cell: ({ row }) => row.original.meta.language?.toUpperCase() ?? "n/a",
      },
      {
        header: "Updated",
        accessorKey: "meta.updatedAt",
        cell: ({ row }) =>
          row.original.meta.updatedAt
            ? new Date(row.original.meta.updatedAt).toLocaleString()
            : "—",
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="d-flex flex-wrap gap-2">
            <Button size="sm" variant="light" onClick={() => navigate(`/resume/${row.original.recordId}/view`)}>
              View resume
            </Button>
            <Button
              size="sm"
              variant="light"
              color="primary"
              onClick={() => navigate(`/resume/${row.original.recordId}/profile`)}
            >
              Edit resume
            </Button>
            <Button
              size="sm"
              variant="light"
              color="danger"
              onClick={() => handleDelete(row.original.recordId)}
              disabled={deletingId === row.original.recordId && deleteMutation.isPending}
            >
              {deletingId === row.original.recordId && deleteMutation.isPending ? "Deleting..." : "Delete resume"}
            </Button>
          </div>
        ),
      },
    ],
    [navigate, deleteMutation.isPending, deletingId],
  );

  const handleDelete = async (resumeId: string) => {
    if (!window.confirm("Delete this resume? This cannot be undone.")) {
      return;
    }
    setStatusMessage(null);
    setDeletingId(resumeId);
    await deleteMutation.mutateAsync(resumeId);
  };

  const handleResumeCreated = async (record: ResumeRecordWithId) => {
    await reload();
    navigate(`/resume/${record.recordId}/profile`);
  };

  const openCreateModal = () => {
    showModal({
      header: (
        <Modal.Header>
          <Modal.Title>Generate a resume</Modal.Title>
        </Modal.Header>
      ),
      body: ({ close }) => (
        <CreateResumeModal
          close={close}
          userId={user?.id}
          onCreated={handleResumeCreated}
        />
      ),
      modalProps: {
        centered: true,
        scrollable: true,
        size: "lg",
      },
    });
  };

  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">Resumes</div>
              <h2 className="page-title">You can View, Edit or Add a resume</h2>

            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">


                <Button variant="light" className="btn-primary btn-outline" onClick={openCreateModal}>
                  <IconFileCv size={16} /> Add resume
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            {statusMessage ? (
              <div className="col-12">
                <Alert color={statusMessage.type === "success" ? "green" : "red"} className="mb-3">
                  {statusMessage.message}
                </Alert>
              </div>
            ) : null}
            <div className="col-12">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title className="mb-1">My resumes</Card.Title>
                    <Text muted size="sm">Review, edit, or delete your resumes.</Text>
                  </div>
                  <Button variant="light" size="sm" onClick={reload} disabled={loading}>
                    <IconRefresh size={16} className="me-1" />
                    Refresh
                  </Button>
                </Card.Header>
                <Card.Body>
                  {error ? (
                    <Alert color="red" className="mb-3">
                      {error.message}
                    </Alert>
                  ) : null}
                  {records.length === 0 ? (
                    <div className="text-center py-4 text-secondary">
                      <Text muted>No resumes yet. Use the form above to generate one.</Text>
                    </div>
                  ) : (
                    <DataTable
                      data={records}
                      columns={columns}
                      pageSize={5}
                      showNavigation
                      showEntries
                      className="table-vcenter"
                    />
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeAddPage;

type CreateResumeModalProps = {
  userId?: string;
  onCreated: (record: ResumeRecordWithId) => Promise<void> | void;
  close: () => void;
};

function CreateResumeModal({ userId, onCreated, close }: CreateResumeModalProps) {
  const createMutation = useCreateResumeRecord();
  const [values, setValues] = useState<FormState>(INITIAL_VALUES);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string; } | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.currentTarget;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleLanguageChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const { value } = event.currentTarget;
    setValues((previous) => ({ ...previous, language: value as FormState["language"] }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setStatusMessage(null);

    if (!userId) {
      setStatusMessage({ type: "error", message: "You must be signed in to create a resume." });
      return;
    }

    const parsed = createSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setFormErrors({
        resumeName: fieldErrors.resumeName?.[0],
        language: fieldErrors.language?.[0],
        purpose: fieldErrors.purpose?.[0],
      });
      return;
    }

    setFormErrors({});

    try {
      const payload = {
        name: parsed.data.resumeName.trim(),
        language: parsed.data.language,
        purpose: parsed.data.purpose?.trim() ? parsed.data.purpose.trim() : undefined,
        userId,
      };
      const record = await createMutation.mutateAsync(payload);
      await onCreated(record);
      close();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not create the resume.";
      setStatusMessage({ type: "error", message });
    }
  };

  return (
    <>
      <Modal.Body>
        <Text muted size="sm" className="d-block mb-3">
          Provide the basics and we&apos;ll launch you into the builder for detailed editing.
        </Text>
        {statusMessage ? (
          <Alert color={statusMessage.type === "success" ? "green" : "red"} className="mb-3">
            {statusMessage.message}
          </Alert>
        ) : null}
        <form className="row g-3" onSubmit={handleSubmit} id="create-resume-form" noValidate>
          <div className="col-12 col-md-6">
            <Form.Input
              label="Resume name"
              name="resumeName"
              value={values.resumeName}
              onChange={handleChange}
              error={formErrors.resumeName}
              disabled={createMutation.isPending}
            />
          </div>
          <div className="col-12 col-md-6">
            <Form.Select
              label="Language"
              name="language"
              value={values.language}
              onChange={handleLanguageChange}
              error={formErrors.language}
              disabled={createMutation.isPending}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-12 col-md-6">
            <Form.Input
              label="Purpose (optional)"
              name="purpose"
              value={values.purpose ?? ""}
              onChange={handleChange}
              error={formErrors.purpose}
              disabled={createMutation.isPending}
              placeholder="e.g., Leadership Portfolio"
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={close} disabled={createMutation.isPending}>
          Cancel
        </Button>
        <Button color="primary" type="submit" form="create-resume-form" loading={createMutation.isPending}>
          <IconPlus size={16} className="me-2" />
          Generate and open builder
        </Button>
      </Modal.Footer>
    </>
  );
}
