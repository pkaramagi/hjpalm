/**
 * Validation utilities for resume data
 */

/**
 * Email validation pattern
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
 * Validates a phone number (basic check for non-empty)
 * @param phone - Phone number to validate
 * @returns true if phone is provided
 */
export const isValidPhone = (phone?: string): boolean => {
  return Boolean(phone?.trim());
};
