import { useMemo } from "react";
import type { UserRead } from "@/client";

interface UserStats {
  total: number;
  active: number;
  inactive: number;
}

/**
 * Custom hook to calculate user statistics
 * @param users - Array of users
 * @returns Memoized statistics object
 */
export function useUserStats(users: UserRead[]): UserStats {
  return useMemo(() => {
    const active = users.filter((user) => user.is_active).length;
    const inactive = users.length - active;
    return { total: users.length, active, inactive };
  }, [users]);
}
