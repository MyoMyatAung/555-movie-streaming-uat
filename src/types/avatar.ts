export interface Avatar {
  id: string;
  name: string;
  image: string;
  level_id: number;
  level_name: string;
  level_rank: string;
}

export interface AvatarList {
  is_available: boolean;
  level: string;
  list: Avatar[];
}

export interface AvatarListResponse {
  code?: number;
  status?: boolean;
  message?: string;
  data?: AvatarList[];
}

export interface SetAvatarRequest {
  avatar_id: string;
}

export interface SetAvatarResponse {
  code?: number;
  status?: boolean;
  message?: string;
  data?: {
    success: boolean;
    avatar?: string;
  };
}
