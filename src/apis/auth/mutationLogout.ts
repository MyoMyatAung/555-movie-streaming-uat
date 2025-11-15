import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { LogoutResponse } from "@/types/auth";
import { logoutApi } from "./authApi";

type LogoutError = {
  message: string;
  status?: number;
};

export function useLogout(
  options?: UseMutationOptions<LogoutResponse, LogoutError>,
) {
  return useMutation({
    mutationFn: () => logoutApi(),
    ...options,
  });
}
