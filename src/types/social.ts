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
  data?: {
    url: string;
  };
}

export interface SocialLoginCallbackRequest {
  provider: string;
  intent?: string;
  code: string;
}

export interface SocialLoginCallbackResponse {
  code: string;
  data?: {
    isBound: boolean;
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
    socialUserInfo?: {
      avatar: string;
      email: string;
      gender: string;
      tempToken?: string;
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
  };
}

export interface SocialRegisterRequest {
  tempToken: string;
  username: string;
  password: string;
}

export interface SocialRegisterResponse {
  code: string;
  data?: {
    user: {
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
    token: {
      accessToken: string;
      accessTokenExpiresIn: number;
      refreshToken: string;
      refreshTokenExpiresIn: number;
    };
  };
}
