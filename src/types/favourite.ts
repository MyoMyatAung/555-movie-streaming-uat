/**
 * Favourite Types
 *
 * TypeScript types for the Favourite feature.
 * Favourites allow users to bookmark posts for quick access.
 *
 * API Reference: See api.md - Favourite API section
 */

// =============================================================================
// API Request Types
// =============================================================================

/**
 * Add Favourite Request
 */
export interface FavouriteRequest {
  post_id: string;
}

/**
 * Remove Favourite Request
 * Supports single or batch removal
 */
export interface RemoveFavouriteRequest {
  post_id: string | string[];
}

/**
 * Check Favourite Request
 */
export interface CheckFavouriteParams {
  post_id: string;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Base API Response
 */
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

/**
 * Add Favourite Response Data
 */
export interface AddFavouriteData {
  is_favourite: true;
  favourites_count: number;
  favourited_at: string;
}

/**
 * Remove Favourite Response Data (single)
 */
export interface RemoveFavouriteData {
  is_favourite: false;
  favourites_count: number;
}

/**
 * Remove Favourite Response Data (batch)
 */
export interface RemoveFavouriteBatchData {
  removed: Array<{
    post_id: string;
    favourites_count: number;
  }>;
  failed: Array<{
    post_id: string;
    error: string;
  }>;
  removed_count: number;
  failed_count: number;
}

/**
 * Check Favourite Response Data
 */
export interface CheckFavouriteData {
  is_favourite: boolean;
  favourites_count: number;
}

/**
 * Favourite Post Item (from list endpoint)
 */
export interface FavouritePost {
  id: string;
  title: string;
  favourited_at: string;
  is_favourite: boolean;
  favourites_count: number;
  files: Array<{
    size: string;
    type: string;
    width: number;
    height: number;
    suffix: string;
    duration?: number;
    thumbnail: string;
    resourceURL: string;
  }>;
  user?: {
    user_id: string;
    username: string;
    nickname: string;
    avatar?: string;
  };
  tag?: string[];
}

/**
 * Favourite List Response Data
 */
export interface FavouriteListData {
  favourites: FavouritePost[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

