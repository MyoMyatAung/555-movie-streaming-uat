import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type {
  AccountSetupRequest,
  AccountSetupResponse,
  EmailOtpLoginRequest,
  EmailOtpLoginResponse,
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
  PhoneOtpLoginRequest,
  PhoneOtpLoginResponse,
  UserResponse,
} from "@/types/auth";
import type { RegisterRequest, RegisterResponse } from "@/types/register";

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Register with phone
 */
export async function registerApi(
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await AXIOS_CLIENT.post<RegisterResponse>(
    `${AUTH_BASE_URL}/auth/signup`,
    payload,
  );
  return response.data;
}

/**
 * Login with email and password
 */
export async function loginApi(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await AXIOS_CLIENT.post<LoginResponse>(
    `${AUTH_BASE_URL}/auth/login/password`,
    credentials,
  );
  return response.data;
}

/**
 * Email OTP login
 */
export async function emailOtpLoginApi(
  payload: EmailOtpLoginRequest,
): Promise<EmailOtpLoginResponse> {
  const response = await AXIOS_CLIENT.post<EmailOtpLoginResponse>(
    `${AUTH_BASE_URL}/auth/login/email-otp`,
    payload,
  );

  return response.data;
}

/**
 * Phone OTP login
 */
export async function phoneOtpLoginApi(
  payload: PhoneOtpLoginRequest,
): Promise<PhoneOtpLoginResponse> {
  const response = await AXIOS_CLIENT.post<PhoneOtpLoginResponse>(
    `${AUTH_BASE_URL}/auth/login/phone-otp`,
    payload,
  );

  return response.data;
}

/**
 * Complete account setup with nickname and password
 */
export async function accountSetupApi(
  payload: AccountSetupRequest,
): Promise<AccountSetupResponse> {
  const response = await AXIOS_CLIENT.post<AccountSetupResponse>(
    `${AUTH_BASE_URL}/auth/account-setup`,
    payload,
  );
  console.log({ response });
  return response.data;
}

/**
 * Get current user profile
 */
export async function getMeApi(token: string): Promise<UserResponse> {
  const response = await AXIOS_CLIENT.get<UserResponse>(
    `${AUTH_BASE_URL}/profile/get-own-profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log({ response });
  return response.data;
}

/**
 * Logout
 */
export async function logoutApi(): Promise<LogoutResponse> {
  const response = await AXIOS_CLIENT.post<LogoutResponse>(
    `${AUTH_BASE_URL}/auth/logout`,
  );
  return response.data;
}
