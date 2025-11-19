import { useState, useCallback } from "react";
import {
  validateRequired,
  validatePassword,
  validatePasswordConfirmation,
  validatePasswordChange,
} from "../utils/validators";

export interface PasswordFormFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type PasswordFormErrors = Partial<Record<keyof PasswordFormFields, string>>;

interface UsePasswordFormOptions {
  onSubmit: (values: PasswordFormFields) => void | Promise<void>;
}

const INITIAL_VALUES: PasswordFormFields = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

/**
 * Custom hook to manage password change form state and validation
 */
export function usePasswordForm({ onSubmit }: UsePasswordFormOptions) {
  const [values, setValues] = useState<PasswordFormFields>(INITIAL_VALUES);
  const [errors, setErrors] = useState<PasswordFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      const { name, value } = target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error for this field when user starts typing
      if (errors[name as keyof PasswordFormFields]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const validate = useCallback((): boolean => {
    const nextErrors: PasswordFormErrors = {};

    // Validate current password
    const currentResult = validateRequired(values.currentPassword, "Current password");
    if (!currentResult.valid) {
      nextErrors.currentPassword = currentResult.error;
    }

    // Validate new password
    const newPasswordResult = validatePassword(values.newPassword);
    if (!newPasswordResult.valid) {
      nextErrors.newPassword = newPasswordResult.error;
    } else {
      // Check if new password is different from current
      const changeResult = validatePasswordChange(
        values.currentPassword,
        values.newPassword
      );
      if (!changeResult.valid) {
        nextErrors.newPassword = changeResult.error;
      }
    }

    // Validate password confirmation
    const confirmResult = validatePasswordConfirmation(
      values.newPassword,
      values.confirmPassword
    );
    if (!confirmResult.valid) {
      nextErrors.confirmPassword = confirmResult.error;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [values]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      if (!validate()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
        // Reset form on successful submission
        setValues(INITIAL_VALUES);
        setErrors({});
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, onSubmit, values]
  );

  const reset = useCallback(() => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
  };
}
