import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  authListUsersOptions,
  authListUsersQueryKey,
  authUpdateUserMutation,
} from "@/client/@tanstack/react-query.gen";
import type { AuthListUsersData, Options, UserRead } from "@/client";

export function useAdminUsers(options?: Options<AuthListUsersData>) {
  const queryClient = useQueryClient();
  const usersQuery = useQuery(authListUsersOptions(options));
  const baseUpdateOptions = authUpdateUserMutation();
  const updateMutation = useMutation({
    ...baseUpdateOptions,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: authListUsersQueryKey(options) });
      if (baseUpdateOptions.onSuccess) {
        await baseUpdateOptions.onSuccess(...args);
      }
    },
  });

  const toggleStatus = useCallback(
    async (userId: string, nextActive: boolean) => {
      await updateMutation.mutateAsync({
        path: { user_id: userId },
        body: { is_active: nextActive },
      });
    },
    [updateMutation],
  );

  return {
    users: (usersQuery.data ?? []) as UserRead[],
    loading: usersQuery.isLoading,
    error: usersQuery.error as Error | null,
    refresh: usersQuery.refetch,
    toggleStatus,
    isUpdating: updateMutation.isPending,
  };
}
