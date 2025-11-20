/**
 * Shared formatting utilities used across the application
 */

/**
 * Generates initials from a name string
 * @param name - Full name (e.g., "John Doe" or "김철수")
 * @param fallback - Fallback string if name is empty (default: "UP")
 * @returns Uppercase initials (max 2 characters)
 */
export const getInitials = (name?: string, fallback = "UP"): string => {
  if (!name || !name.trim()) return fallback;

  return name
    .trim()
    .split(/\s+/)
    .map((segment) => segment.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/**
 * Formats a display name from profile data
 * @param koreanName - Korean name
 * @param firstName - English first name
 * @param lastName - English last name
 * @returns Formatted display name or fallback
 */
export const formatDisplayName = (
  koreanName?: string,
  firstName?: string,
  lastName?: string,
): string => {
  if (koreanName?.trim()) {
    return koreanName.trim();
  }

  const englishName = [firstName, lastName]
    .filter(Boolean)
    .map(s => s?.trim())
    .join(" ");

  return englishName || "Unnamed profile";
};

/**
 * Checks if a string contains a search needle (case-insensitive)
 * @param value - String to search in
 * @param needle - Search term
 * @returns true if value contains needle
 */
export const containsText = (
  value: string | undefined | null,
  needle: string,
): boolean => {
  return Boolean(value) && value!.toLowerCase().includes(needle.toLowerCase());
};

/**
 * Gets the latest entry from an array (assumes first item is latest)
 * @param entries - Array of entries
 * @returns First entry or undefined
 */
export const getLatestEntry = <T,>(entries?: T[]): T | undefined => {
  return entries && entries.length > 0 ? entries[0] : undefined;
};

/**
 * Formats a phone number for display
 * @param mobile - Mobile phone number
 * @param extension - Extension number
 * @returns Formatted phone or empty string
 */
export const formatPhone = (mobile?: string, extension?: string): string => {
  return mobile?.trim() || extension?.trim() || "";
};

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
