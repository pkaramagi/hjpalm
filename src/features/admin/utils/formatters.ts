/**
 * Formatting utilities for admin-related data
 */

import type { UserRead } from "@/client";
import { getInitials as sharedGetInitials } from "@/shared/utils/formatters";

/**
 * Formats a date for display in the user table
 * @param iso - ISO date string or Date object
 * @returns Formatted date string or "Never"
 */
export const formatDate = (iso?: Date | string | null): string => {
  if (!iso) return "Never";
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Gets initials from a user object
 * @param user - User object
 * @returns Uppercase initials
 */
export const getUserInitials = (user: UserRead): string => {
  const source = user.name || user.email || user.username;
  return sharedGetInitials(source, "U");
};

/**
 * Gets display name from a user object
 * @param user - User object
 * @returns Display name (name, username, or email)
 */
export const getUserDisplayName = (user: UserRead): string => {
  return user.name ?? user.username ?? user.email ?? "Unknown User";
};
