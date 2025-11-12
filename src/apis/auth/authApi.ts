import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type {
  AccountSetupRequest,
  AccountSetupResponse,
  LoginCredentials,
  LoginResponse,
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
    `${AUTH_BASE_URL}/auth/password-login`,
    credentials,
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
