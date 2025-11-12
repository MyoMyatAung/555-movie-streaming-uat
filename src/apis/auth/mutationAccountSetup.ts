import { accountSetupApi } from "@/apis/auth/authApi";
import type { AccountSetupRequest, AccountSetupResponse } from "@/types/auth";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

type AccountSetupError = {
  message: string;
  status?: number;
  [key: string]: any;
};

/**
 * Hook to complete account setup with nickname and password
 */
export function useAccountSetup(
  options?: UseMutationOptions<
    AccountSetupResponse,
    AccountSetupError,
    AccountSetupRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: AccountSetupRequest) => accountSetupApi(payload),
    ...options,
  });
}
