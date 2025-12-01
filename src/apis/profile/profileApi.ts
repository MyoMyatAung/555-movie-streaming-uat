import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type {
  ChangeEmailRequest,
  ChangeEmailResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ChangePhoneRequest,
  ChangePhoneResponse,
  UpdateNicknameRequest,
  UpdateNicknameResponse,
} from "@/types/profile";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Update user nickname
 */
export async function updateNicknameApi(
  payload: UpdateNicknameRequest,
): Promise<UpdateNicknameResponse> {
  const response = await AXIOS_CLIENT.put<UpdateNicknameResponse>(
    `${API_BASE_URL}/profile/update-nickname`,
    payload,
  );
  return response.data;
}

/**
 * Change user email
 */
export async function changeEmailApi(
  payload: ChangeEmailRequest,
): Promise<ChangeEmailResponse> {
  const response = await AXIOS_CLIENT.post<ChangeEmailResponse>(
    `${API_BASE_URL}/profile/change-email`,
    payload,
  );
  return response.data;
}

/**
 * Change user phone number
 */
export async function changePhoneApi(
  payload: ChangePhoneRequest,
): Promise<ChangePhoneResponse> {
  const response = await AXIOS_CLIENT.post<ChangePhoneResponse>(
    `${API_BASE_URL}/profile/change-phone-number`,
    payload,
  );
  return response.data;
}

/**
 * Change user password
 */
export async function changePasswordApi(
  payload: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
  const response = await AXIOS_CLIENT.post<ChangePasswordResponse>(
    `${API_BASE_URL}/profile/change-password`,
    payload,
  );
  return response.data;
}
