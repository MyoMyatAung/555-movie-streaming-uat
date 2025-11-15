import { queryOptions, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/useAuthStore";
import { getMeApi } from "./authApi";

export const getMeQueryOptions = (token: string) => {
  return queryOptions({
    queryKey: ["auth", "me", token],
    queryFn: () => getMeApi(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
};

interface UseGetMeOptions {
  token?: string | null;
}

export function useGetMe({ token }: UseGetMeOptions = {}) {
  const query = useQuery({
    ...getMeQueryOptions(token || ""),
    enabled: !!token,
  });

  if ((query.error as any)?.response?.status === 403) {
    useAuthStore.getState().clearAuth();
  }

  const user = query.data?.data;

  return {
    ...query,
    user,
  };
}
