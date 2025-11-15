import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { PhoneOtpLoginRequest, PhoneOtpLoginResponse } from "@/types/auth";

import { phoneOtpLoginApi } from "@/apis/auth/authApi";

/**
 * React Query mutation for phone OTP login
 */
export function usePhoneOtpLogin(
  options?: UseMutationOptions<
    PhoneOtpLoginResponse,
    Error,
    PhoneOtpLoginRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: PhoneOtpLoginRequest) => phoneOtpLoginApi(payload),
    ...options,
  });
}
