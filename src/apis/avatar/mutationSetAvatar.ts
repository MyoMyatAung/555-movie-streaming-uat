import type { SetAvatarRequest, SetAvatarResponse } from "@/types/avatar";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { setAvatarApi } from "./avatarApi";

type SetAvatarError = {
  message: string;
  status?: number;
  [key: string]: any;
};

/**
 * Hook to set user avatar
 */
export function useSetAvatar(
  options?: UseMutationOptions<
    SetAvatarResponse,
    SetAvatarError,
    SetAvatarRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: SetAvatarRequest) => setAvatarApi(payload),
    ...options,
  });
}
