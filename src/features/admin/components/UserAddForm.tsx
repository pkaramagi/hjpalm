import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Badge, Button, Card, Form, Text } from "tabler-react-ui";
import { z } from "zod";

import { ADMIN_ROLE_OPTIONS } from "../constants/roles";
import type { AdminUserRole, CreateAdminUserInput } from "../types";
import { authCreateUserMutation } from "@/client/@tanstack/react-query.gen";
import type { UserCreate } from "@/client";
import { zUserCreate } from "@/client/zod.gen";

const INITIAL_VALUES: CreateAdminUserInput = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  role: "staff",
  phone: "",
  location: "",
};

type FormErrors = Partial<Record<keyof CreateAdminUserInput, string>>;

const ROLE_TO_AUTH_ROLE: Record<AdminUserRole, NonNullable<UserCreate["role_name"]>> = {
  admin: "admin",
  manager: "admin",
  staff: "user",
  viewer: "user",
};

type UserAddFormProps = {
  onAddUser?: (payload: CreateAdminUserInput) => Promise<unknown>;
  onCancel?: () => void;
  variant?: "card" | "modal";
};

const userAddSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: zUserCreate.shape.email,
  department: z.string().trim().min(1, "Department is required"),
  role: z.enum(["admin", "manager", "staff", "viewer"]),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
});

export function UserAddForm({ onAddUser, onCancel, variant = "card" }: UserAddFormProps) {
  const [values, setValues] = useState<CreateAdminUserInput>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string; } | null>(
    null,
  );
  const createUserMutation = useMutation(authCreateUserMutation());
  const submitting = createUserMutation.isPending;
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.currentTarget;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSelect: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const { name, value } = event.currentTarget;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const parsed = userAddSchema.safeParse(values);
    if (!parsed.success) {
      const issueMap = parsed.error.issues.reduce<Partial<Record<keyof typeof values, string>>>(
        (acc, issue) => {
          const field = issue.path[0];
          if (typeof field === "string" && !(field in acc)) {
            acc[field as keyof typeof values] = issue.message;
          }
          return acc;
        },
        {},
      );
      setErrors(issueMap);
      return;
    }
    setErrors({});

    setStatus(null);

    try {
      const cleaned = parsed.data;
      const normalizedInput: CreateAdminUserInput = {
        ...cleaned,
        email: cleaned.email.trim().toLowerCase(),
        phone: cleaned.phone ? cleaned.phone : undefined,
        location: cleaned.location ? cleaned.location : undefined,
      };

      const fullName = `${normalizedInput.firstName} ${normalizedInput.lastName}`.trim();
      const displayName = fullName || normalizedInput.email;
      const userCreatePayload: UserCreate = {
        username: normalizedInput.email,
        email: normalizedInput.email,
        name: displayName,
        is_active: true,
        role_name: ROLE_TO_AUTH_ROLE[normalizedInput.role],
      };

      zUserCreate.parse(userCreatePayload);
      await createUserMutation.mutateAsync({ body: userCreatePayload });
      if (onAddUser) {
        await onAddUser(normalizedInput);
      }

      setStatus({ type: "success", message: `${displayName} added.` });
      setValues((prev) => ({ ...INITIAL_VALUES, role: prev.role }));
    } catch (err) {

      setStatus({
        type: "error",
        message: err ? err?.detail : "Failed to add the user.",
      });
    }
  };
  const description = "Create an account for a teammate with the right level of permissions.";
  const headerContent = (
    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
      <div>
        {variant === "card" ? (
          <Card.Title subtitle={description} className="mb-1">
            Add a user
          </Card.Title>
        ) : (
          <>
            <h5 className="mb-1">Add a user</h5>
            <Text muted size="sm">{description}</Text>
          </>
        )}
      </div>
      <Badge color="green" variant="light">
        Self-service
      </Badge>
    </div>
  );
  const formContent = (
    <>
      {status ? (
        <div role="alert" className={`alert alert-${status.type === "success" ? "success" : "danger"} mb-3`}>
          {status.message}
        </div>
      ) : null}

      <form className="row g-3" onSubmit={handleSubmit} noValidate>
        <div className="col-12 col-md-6">
          <Form.Input
            label="First name"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            error={errors.firstName}
            disabled={submitting}
          />
        </div>
        <div className="col-12 col-md-6">
          <Form.Input
            label="Last name"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            error={errors.lastName}
            disabled={submitting}
          />
        </div>
        <div className="col-12">
          <Form.Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            disabled={submitting}
            placeholder="teammate@example.com"
          />
        </div>
        <div className="col-12 col-md-6">
          <Form.Input
            label="Department"
            name="department"
            value={values.department}
            onChange={handleChange}
            error={errors.department}
            disabled={submitting}
          />
        </div>
        <div className="col-12 col-md-6">
          <Form.Select
            label="Role"
            name="role"
            value={values.role}
            onChange={handleSelect}
            disabled={submitting}
          >
            {ADMIN_ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Form.Select>
          {errors.role ? <small className="text-danger d-block mt-1">{errors.role}</small> : null}
        </div>
        <div className="col-12 col-md-6">
          <Form.Input
            label="Phone (optional)"
            name="phone"
            value={values.phone ?? ""}
            onChange={handleChange}
            disabled={submitting}
            placeholder="+82 10-0000-0000"
          />
        </div>
        <div className="col-12 col-md-6">
          <Form.Input
            label="Location (optional)"
            name="location"
            value={values.location ?? ""}
            onChange={handleChange}
            disabled={submitting}
            placeholder="Seoul HQ"
          />
        </div>
        <div className="col-12 d-flex justify-content-end gap-2">
          {onCancel ? (
            <Button type="button" variant="light" color="secondary" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
          ) : null}
          <Button type="submit" color="primary" disabled={submitting}>
            {submitting ? "Adding user..." : "Add user"}
          </Button>
        </div>
        <div className="col-12">
          <Text muted size="xs" className="mb-0">
            New users receive an email with a temporary password and will be asked to update it on their first sign in.
          </Text>
        </div>
      </form>
    </>
  );

  return variant === "card" ? (
    <Card className="mb-4">
      <Card.Header>{headerContent}</Card.Header>
      <Card.Body>{formContent}</Card.Body>
    </Card>
  ) : (
    <div className="d-grid gap-3">
      {headerContent}
      {formContent}
    </div>
  );
}

export default UserAddForm;
