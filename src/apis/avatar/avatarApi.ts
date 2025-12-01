import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type {
  AvatarListResponse,
  SetAvatarRequest,
  SetAvatarResponse,
} from "@/types/avatar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get list of available avatars
 */
export async function getAvatarListApi(): Promise<AvatarListResponse> {
  const response = await AXIOS_CLIENT.get<AvatarListResponse>(
    `${API_BASE_URL}/avatar/list`,
  );
  return response.data;
}

/**
 * Set user avatar
 */
export async function setAvatarApi(
  payload: SetAvatarRequest,
): Promise<SetAvatarResponse> {
  const response = await AXIOS_CLIENT.post<SetAvatarResponse>(
    `${API_BASE_URL}/avatar/upload`,
    payload,
  );
  return response.data;
}
