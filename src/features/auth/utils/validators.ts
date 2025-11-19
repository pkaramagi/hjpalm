/**
 * Validation utilities for auth-related data
 */

/**
 * Email validation pattern
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Minimum password length
 */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Validates an email address
 * @param email - Email string to validate
 * @returns true if valid email format
 */
export const isValidEmail = (email?: string): boolean => {
  if (!email) return false;
  return EMAIL_PATTERN.test(email.trim());
};

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Object with validation result and error message
 */
export const validatePassword = (password: string): { valid: boolean; error?: string; } => {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` };
  }

  return { valid: true };
};

/**
 * Validates password confirmation
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Object with validation result and error message
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): { valid: boolean; error?: string; } => {
  if (!confirmPassword) {
    return { valid: false, error: "Please re-enter your password" };
  }

  if (confirmPassword !== password) {
    return { valid: false, error: "Passwords do not match" };
  }

  return { valid: true };
};

/**
 * Validates that new password is different from current password
 * @param currentPassword - Current password
 * @param newPassword - New password
 * @returns Object with validation result and error message
 */
export const validatePasswordChange = (
  currentPassword: string,
  newPassword: string
): { valid: boolean; error?: string; } => {
  if (newPassword === currentPassword) {
    return { valid: false, error: "New password must be different from the current password" };
  }

  return { valid: true };
};

/**
 * Validates a required field
 * @param value - Field value
 * @param fieldName - Name of the field for error message
 * @returns Object with validation result and error message
 */
export const validateRequired = (
  value: string,
  fieldName: string
): { valid: boolean; error?: string; } => {
  if (!value || !value.trim()) {
    return { valid: false, error: `${fieldName} is required` };
  }

  return { valid: true };
};
