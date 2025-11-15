// Auth types
export interface LoginCredentials {
  username: string;
  password?: string;
  token?: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  // refreshToken: string;
  // refreshTokenExpiresIn: number;
}

export interface LoginResponse {
  data?: AuthTokens;
  message?: string;
  status?: boolean;
}

export interface User {
  id: string;
  uid?: string;
  email: string;
  name?: string;
  nickname?: string;
  bio?: string;
  gender?: string;
  country?: string;
  city?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export type UserField = keyof Pick<
  User,
  "nickname" | "bio" | "gender" | "country" | "city" | "avatar"
>;

export interface ProfileUpdateData extends Partial<Pick<User, UserField>> {}

export interface UserResponse {
  data: User;
  message?: string;
  success?: boolean;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface EmailOtpLoginRequest {
  email: string;
  token: string;
}

export interface EmailOtpLoginResponse {
  code: string;
  data?: {
    user: {
      id: string;
      username: string;
      nickname: string;
      email: string;
      phone: string;
      status: string;
    };
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface PhoneOtpLoginRequest {
  token: string;
  phone: string;
}

export interface PhoneOtpLoginResponse {
  code: string;
  data?: {
    user: {
      id: string;
      username: string;
      nickname: string;
      email: string;
      phone: string;
      status: string;
    };
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface UpdateUsernameRequest {
  username: string;
  currentPassword: string;
}

export interface UpdateUsernameResponse {
  code: number;
  message: string;
  data: {
    uid: string;
    username: string;
    email: string;
    updatedAt: string;
  };
  meta: {
    timestamp: string;
    traceId: string;
  };
}

export interface UpdatePhoneRequest {
  countryCode: string;
  phoneNumber: string;
  code: number;
  currentPassword: string;
}

export interface UpdatePhoneResponse {
  code: number;
  message: string;
  data: {
    uid: string;
    phone: string;
    updatedAt: string;
  };
  meta: {
    timestamp: string;
    traceId: string;
  };
}

export interface SendResetPasswordCodeRequest {
  account?: string;
}

export interface SendResetPasswordCodeResponse {
  code: number;
  message: string;
  data?: {
    channel: boolean;
    to: number;
    token?: string;
  };
}

export interface ResetPasswordRequest {
  token: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  code: number;
  message: string;
  data?: {
    success: boolean;
  };
}

export interface AccountSetupRequest {
  token: string;
  nickname: string;
  password: string;
}

export interface AccountSetupResponse {
  code?: number;
  status?: boolean;
  message?: string;
  data?: {
    success?: boolean;
    access_token?: string;
    expires_in?: number;
    token_type?: string;
    [key: string]: any;
  };
}

export interface LogoutResponse {
  status: string;
  message: string;
}
