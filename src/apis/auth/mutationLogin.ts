import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { LoginCredentials, LoginResponse } from "@/types/auth";
import { loginApi } from "./authApi";

type LoginError = {
  message: string;
  status?: number;
};

export function useLogin(
  options?: UseMutationOptions<LoginResponse, LoginError, LoginCredentials>,
) {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    ...options,
  });
}
