import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type {
  ForgotPasswordResetRequest,
  ForgotPasswordResetResponse,
} from "@/types/auth";
import { forgotPasswordResetApi } from "./authApi";

type ForgotPasswordResetError = {
  message: string;
  status?: number;
};

/**
 * React Query mutation for forgot password reset
 */
export function useForgotPasswordReset(
  options?: UseMutationOptions<
    ForgotPasswordResetResponse,
    ForgotPasswordResetError,
    ForgotPasswordResetRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: ForgotPasswordResetRequest) =>
      forgotPasswordResetApi(payload),
    ...options,
  });
}
