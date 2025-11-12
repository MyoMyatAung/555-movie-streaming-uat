import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type {
  SocialLoginCallbackRequest,
  SocialLoginCallbackResponse,
  SocialLoginUrlRequest,
  SocialLoginUrlResponse,
  SocialProvidersResponse,
  SocialRegisterRequest,
  SocialRegisterResponse,
} from "@/types/social";

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get social login providers
 */
export async function getSocialProvidersApi(): Promise<SocialProvidersResponse> {
  const response = await AXIOS_CLIENT.get<SocialProvidersResponse>(
    `${AUTH_BASE_URL}/auth/social-login/providers`,
  );
  console.log(response);
  return response.data;
}

/**
 * Get social login URL
 */
export async function getSocialLoginUrlApi(
  payload: SocialLoginUrlRequest,
): Promise<SocialLoginUrlResponse> {
  const response = await AXIOS_CLIENT.post<SocialLoginUrlResponse>(
    `${AUTH_BASE_URL}/auth/social-login/login-url`,
    payload,
  );
  return response.data;
}

/**
 * Handle social login callback
 */
export async function socialLoginCallbackApi(
  payload: SocialLoginCallbackRequest,
): Promise<SocialLoginCallbackResponse> {
  const response = await AXIOS_CLIENT.post<SocialLoginCallbackResponse>(
    `${AUTH_BASE_URL}/auth/social-login/callback`,
    payload,
  );
  return response.data;
}

/**
 * Register with social account
 */
export async function socialRegisterApi(
  payload: SocialRegisterRequest,
): Promise<SocialRegisterResponse> {
  const response = await AXIOS_CLIENT.post<SocialRegisterResponse>(
    `${AUTH_BASE_URL}/auth/social-login/register-with-social-account`,
    payload,
  );
  return response.data;
}
