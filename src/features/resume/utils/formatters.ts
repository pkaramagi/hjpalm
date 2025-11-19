/**
 * Utility functions for formatting resume-related data
 */

/**
 * Generates initials from a name string
 * @param name - Full name (e.g., "John Doe" or "김철수")
 * @returns Uppercase initials (max 2 characters)
 */
export const getInitials = (name?: string): string => {
  if (!name) return "UP";
  
  return name
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
