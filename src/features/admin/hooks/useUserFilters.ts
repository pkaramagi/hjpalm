import { useMemo, useState, useCallback } from "react";
import type { RoleRead, UserRead } from "@/client";

export interface UserFilters {
  query: string;
  roleFilter: "all" | RoleRead["name"];
  statusFilter: "all" | "active" | "inactive";
}

interface UseUserFiltersReturn {
  filters: UserFilters;
  filteredUsers: UserRead[];
  setQuery: (query: string) => void;
  setRoleFilter: (role: UserFilters["roleFilter"]) => void;
  setStatusFilter: (status: UserFilters["statusFilter"]) => void;
  resetFilters: () => void;
}

const INITIAL_FILTERS: UserFilters = {
  query: "",
  roleFilter: "all",
  statusFilter: "all",
};

/**
 * Custom hook to manage user filtering logic
 * @param users - Array of users to filter
 * @returns Filter state and filtered users
 */
export function useUserFilters(users: UserRead[]): UseUserFiltersReturn {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserFilters["roleFilter"]>("all");
  const [statusFilter, setStatusFilter] = useState<UserFilters["statusFilter"]>("all");

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        needle.length === 0 ||
        [user.name ?? "", user.email ?? "", user.username ?? "", user.role?.name ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesRole = roleFilter === "all" || user.role?.name === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? user.is_active : !user.is_active);
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [query, roleFilter, statusFilter, users]);

  const resetFilters = useCallback(() => {
    setQuery(INITIAL_FILTERS.query);
    setRoleFilter(INITIAL_FILTERS.roleFilter);
    setStatusFilter(INITIAL_FILTERS.statusFilter);
  }, []);

  return {
    filters: { query, roleFilter, statusFilter },
    filteredUsers,
    setQuery,
    setRoleFilter,
    setStatusFilter,
    resetFilters,
  };
}
