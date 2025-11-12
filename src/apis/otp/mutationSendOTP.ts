import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { SendOTPRequest, SendOTPResponse } from "@/types/otp";
import { sendOTPApi } from "./otpApi";

type SendOTPError = {
  message: string;
  status?: number;
};

/**
 * Hook to send OTP verification code
 *
 * @example
 * ```tsx
 * const { mutate: sendOTP, isPending } = useSendOTP({
 *   onSuccess: (data) => {
 *     console.log("OTP sent successfully:", data);
 *   },
 *   onError: (error) => {
 *     console.error("Failed to send OTP:", error);
 *   }
 * });
 *
 * // Send OTP to email
 * sendOTP({
 *   to: "user@example.com",
 *   channel: "email",
 *   scene: "register"
 * });
 * ```
 */
export function useSendOTP(
  options?: UseMutationOptions<SendOTPResponse, SendOTPError, SendOTPRequest>,
) {
  return useMutation({
    mutationFn: (payload: SendOTPRequest) => sendOTPApi(payload),
    ...options,
  });
}
