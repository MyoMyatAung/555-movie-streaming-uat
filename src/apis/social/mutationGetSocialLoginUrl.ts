import { getSocialLoginUrlApi } from "@/apis/social/socialApi";
import type {
  SocialLoginUrlRequest,
  SocialLoginUrlResponse,
} from "@/types/social";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

/**
 * React Query mutation for getting social login URL
 */
export function useGetSocialLoginUrl(
  options?: UseMutationOptions<
    SocialLoginUrlResponse,
    Error,
    SocialLoginUrlRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: SocialLoginUrlRequest) =>
      getSocialLoginUrlApi(payload),
    ...options,
  });
}
