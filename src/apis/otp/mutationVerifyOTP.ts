import { useMutation } from "@tanstack/react-query";
import { verifyOTPApi } from "./otpApi";

import type { VerifyOTPRequest, VerifyOTPResponse } from "@/types/otp";
import type { UseMutationOptions } from "@tanstack/react-query";

type VerifyOTPError = {
  message: string;
  status?: number;
  [key: string]: any;
};

/**
 * Hook to verify OTP codes
 *
 * @example
 * ```tsx
 * const { mutateAsync: verifyOTP } = useVerifyOTP();
 *
 * await verifyOTP({
 *   channel: "email",
 *   recipient: "user@example.com",
 *   otp: "123456",
 *   action: "register",
 * });
 * ```
 */
export function useVerifyOTP(
  options?: UseMutationOptions<
    VerifyOTPResponse,
    VerifyOTPError,
    VerifyOTPRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: VerifyOTPRequest) => verifyOTPApi(payload),
    ...options,
  });
}
