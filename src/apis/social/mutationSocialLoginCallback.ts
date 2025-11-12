import { socialLoginCallbackApi } from "@/apis/social/socialApi";
import type {
  SocialLoginCallbackRequest,
  SocialLoginCallbackResponse,
} from "@/types/social";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

/**
 * React Query mutation for social login callback
 */
export function useSocialLoginCallback(
  options?: UseMutationOptions<
    SocialLoginCallbackResponse,
    Error,
    SocialLoginCallbackRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: SocialLoginCallbackRequest) =>
      socialLoginCallbackApi(payload),
    ...options,
  });
}
