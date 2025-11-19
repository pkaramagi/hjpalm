import { useState, useCallback } from "react";
import { validateRequired } from "../utils/validators";

export interface ProfileFormFields {
  fullName: string;
  email: string;
  department: string;
  phone: string;
  location: string;
  jobTitle: string;
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormFields, string>>;

interface UseProfileFormOptions {
  initialValues: ProfileFormFields;
  onSubmit: (values: ProfileFormFields) => void | Promise<void>;
}

/**
 * Custom hook to manage profile form state and validation
 */
export function useProfileForm({ initialValues, onSubmit }: UseProfileFormOptions) {
  const [values, setValues] = useState<ProfileFormFields>(initialValues);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      const { name, value } = target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error for this field when user starts typing
      if (errors[name as keyof ProfileFormFields]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const validate = useCallback((): boolean => {
    const nextErrors: ProfileFormErrors = {};

    const fields: Array<{ key: keyof ProfileFormFields; label: string; }> = [
      { key: "fullName", label: "Full name" },
      { key: "email", label: "Email" },
      { key: "department", label: "Department" },
      { key: "phone", label: "Phone number" },
      { key: "location", label: "Location" },
      { key: "jobTitle", label: "Role / Title" },
    ];

    fields.forEach(({ key, label }) => {
      const result = validateRequired(values[key], label);
      if (!result.valid) {
        nextErrors[key] = result.error;
      }
    });

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
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, onSubmit, values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
  };
}
