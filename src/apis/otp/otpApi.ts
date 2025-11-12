import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "@/types/otp";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Send OTP verification code
 */
export async function sendOTPApi(
  payload: SendOTPRequest,
): Promise<SendOTPResponse> {
  const response = await AXIOS_CLIENT.post<SendOTPResponse>(
    `${API_BASE_URL}/auth/send-otp`,
    payload,
  );
  return response.data;
}

/**
 * Verify OTP code
 */
export async function verifyOTPApi(
  payload: VerifyOTPRequest,
): Promise<VerifyOTPResponse> {
  const response = await AXIOS_CLIENT.post<VerifyOTPResponse>(
    `${API_BASE_URL}/auth/check-otp`,
    payload,
  );

  return response.data;
}
