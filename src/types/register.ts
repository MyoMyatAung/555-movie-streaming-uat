/**
 * Register API types
 */

// Base register request
export interface RegisterRequest {
  username: string;
  token: string;
  password?: string;
  nickname?: string;
  code?: number;
}

// Register response
export interface RegisterResponse {
  code: boolean;
  message: string;
  data?: {
    email?: string;
    username?: string;
    profile?: {
      id: string;
      nickname?: string;
      avatar?: string;
      gender?: string;
      city?: string;
      country?: string;
    };
    signup_token?: string;
    token?: {
      accessToken: string;
      accessTokenExpiresIn: number;
      refreshToken: string;
      refreshTokenExpiresIn: number;
    };
  };
}
