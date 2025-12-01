export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdateNicknameResponse {
  code?: number;
  status?: boolean;
  message?: string;
  data?: {
    success: boolean;
    nickname?: string;
  };
}

export interface ChangeEmailRequest {
  email: string;
}

export interface ChangeEmailResponse {
  code?: number;
  status?: boolean;
  message?: string;
  data?: {
    success: boolean;
    email?: string;
  };
}

export interface ChangePhoneRequest {
  phone: string;
}

export interface ChangePhoneResponse {
  code?: number;
  status?: boolean;
  message?: string;
  data?: {
    success: boolean;
    phone?: string;
  };
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface ChangePasswordResponse {
  code?: number;
  status?: boolean;
  message?: string;
  data?: {
    success: boolean;
  };
}
