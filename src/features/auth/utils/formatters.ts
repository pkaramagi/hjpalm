/**
 * Formatting utilities for auth-related data
 */

/**
 * Formats a success message
 * @param message - Success message
 * @returns Formatted success message object
 */
export const formatSuccessMessage = (message: string) => ({
  type: 'success' as const,
  message,
});

/**
 * Formats an error message
 * @param error - Error object or string
 * @param fallback - Fallback message if error is not a string
 * @returns Formatted error message object
 */
export const formatErrorMessage = (error: unknown, fallback = 'An error occurred') => ({
  type: 'error' as const,
  message: error instanceof Error ? error.message : fallback,
});

/**
 * Formats initials from a full name
 * @param name - Full name
 * @returns Uppercase initials (max 2 characters)
 */
export const getInitials = (name?: string): string => {
  if (!name) return "??";

  return name
    .split(/\s+/)
    .map((segment) => segment.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
