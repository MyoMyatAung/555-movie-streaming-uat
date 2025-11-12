import { socialRegisterApi } from "@/apis/social/socialApi";
import type {
  SocialRegisterRequest,
  SocialRegisterResponse,
} from "@/types/social";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

/**
 * React Query mutation for social account registration
 */
export function useSocialRegister(
  options?: UseMutationOptions<
    SocialRegisterResponse,
    Error,
    SocialRegisterRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: SocialRegisterRequest) => socialRegisterApi(payload),
    ...options,
  });
}
