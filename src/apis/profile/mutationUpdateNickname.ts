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
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  changeEmailApi,
  changePasswordApi,
  changePhoneApi,
  updateNicknameApi,
} from "./profileApi";

type UpdateNicknameError = {
  message: string;
  status?: number;
  [key: string]: any;
};

type ChangeEmailError = {
  message: string;
  status?: number;
  [key: string]: any;
};

type ChangePhoneError = {
  message: string;
  status?: number;
  [key: string]: any;
};

type ChangePasswordError = {
  message: string;
  status?: number;
  [key: string]: any;
};

/**
 * Hook to update user nickname
 */
export function useUpdateNickname(
  options?: UseMutationOptions<
    UpdateNicknameResponse,
    UpdateNicknameError,
    UpdateNicknameRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: UpdateNicknameRequest) => updateNicknameApi(payload),
    ...options,
  });
}

/**
 * Hook to change user email
 */
export function useChangeEmail(
  options?: UseMutationOptions<
    ChangeEmailResponse,
    ChangeEmailError,
    ChangeEmailRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: ChangeEmailRequest) => changeEmailApi(payload),
    ...options,
  });
}

/**
 * Hook to change user phone number
 */
export function useChangePhone(
  options?: UseMutationOptions<
    ChangePhoneResponse,
    ChangePhoneError,
    ChangePhoneRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: ChangePhoneRequest) => changePhoneApi(payload),
    ...options,
  });
}

/**
 * Hook to change user password
 */
export function useChangePassword(
  options?: UseMutationOptions<
    ChangePasswordResponse,
    ChangePasswordError,
    ChangePasswordRequest
  >,
) {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePasswordApi(payload),
    ...options,
  });
}
