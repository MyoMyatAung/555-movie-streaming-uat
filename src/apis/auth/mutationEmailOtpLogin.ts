import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { EmailOtpLoginRequest, EmailOtpLoginResponse } from "@/types/auth";

import { emailOtpLoginApi } from "@/apis/auth/authApi";

/**
 * React Query mutation for email OTP login
 */
export function useEmailOtpLogin(
  options?: UseMutationOptions<
    EmailOtpLoginResponse,
    Error,
    EmailOtpLoginRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: EmailOtpLoginRequest) => emailOtpLoginApi(payload),
    ...options,
  });
}
