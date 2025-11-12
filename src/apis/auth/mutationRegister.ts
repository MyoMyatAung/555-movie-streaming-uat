import { registerApi } from "@/apis/auth/authApi";
import type { RegisterRequest, RegisterResponse } from "@/types/register";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

/**
 * React Query mutation for phone registration
 */
export function useRegister(
  options?: UseMutationOptions<RegisterResponse, Error, RegisterRequest>,
) {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => registerApi(payload),
    ...options,
  });
}
