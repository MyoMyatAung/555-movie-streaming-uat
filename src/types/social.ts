/**
 * Social login provider types
 */

export interface SocialProvider {
  providers: Array<string>;
  status: Record<
    string,
    {
      supported: boolean;
      configured: boolean;
    }
  >;
}

export interface SocialProvidersResponse {
  code: string;
  data?: SocialProvider;
}

export interface SocialLoginUrlRequest {
  provider: string;
  redirect_uri: string;
}

export interface SocialLoginUrlResponse {
  code: string;
  qrcode?: string;
  url?: string | null;
}

export interface SocialLoginCallbackRequest {
  provider: string;
  intent?: string;
  code: string;
}

export interface SocialLoginCallbackResponse {
  code: string;
  is_bound: boolean;
  user?: {
    uid: string;
    username: string;
    email?: string;
    phone?: string;
    profile: {
      uid: string;
      nickname?: string;
      bio?: string;
      gender?: "Male" | "Female" | "Other";
      country?: string;
      city?: string;
      avatar?: string;
    };
  };
  social_user_info?: {
    avatar: string;
    email: string;
    gender: string;
    temp_token?: string;
    provider: string;
    socialId: string;
    nickname: string;
  };
  token?: {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  };
}

export interface SocialRegisterRequest {
  temp_token: string;
  username: string;
  password: string;
}

export interface SocialRegisterResponse {
  code: string;
  data?: {
    user: {
      id: string;
      uid: string;
      username: string;
      nickname?: string;
      avatar?: string;
      email?: string;
      social_uid?: string;
      provider?: string;
    };
    token: {
      access_token: string;
      refresh_token: string;
      token_type?: string;
      expires_in?: number;
    };
  };
}
