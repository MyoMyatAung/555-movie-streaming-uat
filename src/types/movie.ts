// Types for movie/TV show data models
// These types are designed to be flexible for API integration later

export type ContentType = "movie" | "tv_series" | "animation";

export type ContentCategory = "all" | "movies" | "tv_series" | "animations";

export type BadgeType =
  | "exclusive" // 独播
  | "most_watched" // 最多人看
  | "highly_recommended" // 高分推荐
  | "best_of_month" // 本月最佳
  | "top_rank"; // Top rank

export interface Badge {
  type: BadgeType;
  label?: string; // Custom label if needed
  rank?: number; // For top rank badges (1-10)
}

export interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  type: ContentType;
  duration?: string; // e.g., "2h 49min"
  episodes?: number; // For TV series
  rating?: number; // e.g., 7.1
  genres?: string[]; // e.g., ["War", "Action"]
  badge?: Badge;
  progress?: number; // 0-100 for continue watching
  episodeInfo?: string; // e.g., "S2.EP3"
  description?: string; // Movie/TV show description
}

export interface HeroBannerItem {
  id: string;
  title: string;
  imageUrl: string;
  genres: string[];
  duration: string;
  description?: string;
}

export interface ContentSection {
  id: string;
  title: string;
  items: ContentItem[];
  showSeeAll?: boolean;
}
