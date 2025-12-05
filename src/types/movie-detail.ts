export interface PostFile {
  size: number;
  type: string;
  width: number;
  height: number;
  suffix: string;
  duration: number;
  thumbnail: string;
  resourceURL: string;
  downloadURL?: string;
}

export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  timestamp: number;
}

export interface SpriteMetadata {
  frames: SpriteFrame[];
  sprite_width: number;
  sprite_height: number;
}

export interface PostUser {
  user_id: string;
  username: string;
  nickname: string;
  name: string;
  avatar: string | null;
  email: string | null;
  phone: string;
  status: string;
  referral_code: string;
}

export interface PostPreview {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  version: string;
  duration: number;
}

export interface PostDetail {
  post_id: string;
  title: string;
  files: PostFile[];
  sprite_url: string;
  sprite_metadata: SpriteMetadata;
  file_type: string;
  privacy: string;
  status: string;
  city: string;
  score: number;
  province: string;
  is_pin: number;
  type: string;
  ads_info: any[];
  preview_image: string;
  tag: string[];
  user: PostUser;
  like_count: number;
  comment_count: number;
  view_count: string;
  preview: PostPreview | null;
  time_ago: string;
  is_liked: boolean;
  is_followed: boolean;
  is_watched: boolean;
  related: any[];
  description: string;
  rating: number;
  episodes: number | null;
  year: number;
}

export interface PostDetailResponse {
  status: boolean;
  message: string;
  data: PostDetail;
}

