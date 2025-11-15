/**
 * Register API types
 */

// Base register request
export interface RegisterRequest {
  username: string;
  password?: string;
  token: string;
  invitation_code?: string;
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
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    refresh_token?: string;
    scope?: string;
  };
}
