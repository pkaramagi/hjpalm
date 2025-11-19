import { useMemo, useState } from "react";
import { Button, Form, Text } from "tabler-react-ui";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import type { RoleRead, UserRead } from "@/client";
import { authUpdateUserMutation } from "@/client/@tanstack/react-query.gen";

type UserEditFormProps = {
  user: UserRead;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ROLE_OPTIONS: RoleRead["name"][] = ["admin", "manager", "user"];

const editSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.enum(ROLE_OPTIONS, {
    errorMap: () => ({ message: "Select a role" }),
  }),
  password: z
    .string()
    .optional()
    .transform((value) => value?.trim() ?? "")
    .refine(
      (value) =>
        value.length === 0 ||
        (value.length >= 12 &&
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /\d/.test(value) &&
          /[^A-Za-z0-9]/.test(value)),
      {
        message:
          "Password should be at least 12 chars and include upper, lower, number, and symbol.",
      },
    ),
});

const getPasswordStrength = (password: string) => {
  if (!password) {
    return { tone: "muted", label: "Not set" as const };
  }
  let score = 0;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 4) return { tone: "success", label: "Strong" as const };
  if (score === 3) return { tone: "warning", label: "Medium" as const };
  return { tone: "danger", label: "Weak" as const };
};

const generateStrongPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%&*?";
  const length = 16;
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export function UserEditForm({ user, onSuccess, onCancel }: UserEditFormProps) {
  const [values, setValues] = useState<{ name: string; role: RoleRead["name"]; password: string; }>({
    name: user.name ?? "",
    role: user.role?.name ?? "user",
    password: "",
  });
  const [errors, setErrors] = useState<Record<keyof typeof values, string | undefined>>({
    name: undefined,
    role: undefined,
    password: undefined,
  });

  const mutation = useMutation(authUpdateUserMutation());

  const passwordStrength = useMemo(() => getPasswordStrength(values.password), [values.password]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event) => {
    const { name, value } = event.currentTarget;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const parsed = editSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        role: fieldErrors.role?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    setErrors({ name: undefined, role: undefined, password: undefined });

    await mutation.mutateAsync({
      path: { user_id: user.id },
      body: {
        name: parsed.data.name,
        role_name: parsed.data.role,
        password: parsed.data.password || undefined,
      },
    });
    onSuccess?.();
  };

  return (
    <form className="d-grid gap-3" onSubmit={handleSubmit} autoComplete="off" noValidate>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <Form.Input label="Email" value={user.email ?? ""} disabled readOnly />
        </div>
        <div className="col-12 col-md-6">
          <Form.Input label="Username" value={user.username ?? ""} disabled readOnly />
        </div>
        <div className="col-12 col-md-6">
          <Form.Input label="Account ID" value={user.id} disabled readOnly />
        </div>
        <div className="col-12 col-md-6">
          <Form.Input
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            disabled={mutation.isLoading}
          />
        </div>
        <div className="col-12">
          <Form.Select
            label="Role"
            name="role"
            value={values.role}
            onChange={handleChange}
            error={errors.role}
            disabled={mutation.isLoading}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="col-12">
          <div className="d-grid gap-2">
            <Form.Input
              label="New password"
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              disabled={mutation.isLoading}
            />
            <div className="d-flex justify-content-between align-items-center">
              <Text size="sm" className={`text-${passwordStrength.tone} mb-0`}>
                Password strength: {passwordStrength.label}
              </Text>
              <Button
                size="xs"
                variant="light"
                color="secondary"
                type="button"
                onClick={() =>
                  setValues((prev) => ({
                    ...prev,
                    password: generateStrongPassword(),
                  }))
                }
                disabled={mutation.isLoading}
              >
                Suggest strong password
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div data-modal-footer className="d-flex justify-content-end gap-2">
        <Button variant="light" color="secondary" type="button" onClick={onCancel} disabled={mutation.isLoading}>
          Cancel
        </Button>
        <Button type="submit" color="primary" loading={mutation.isLoading}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

export default UserEditForm;
