/**
 * Collection Types
 *
 * This module defines TypeScript types for the Collection feature.
 * Collections allow users to organize posts into custom named groups (like playlists).
 *
 * API Reference: See api.md - Collection API section
 *
 * Key Concepts:
 * - Collection: A named group containing multiple posts
 * - CollectionItem: A post within a collection
 * - Virtual "Favorite" collection: Auto-generated from user favourites (id: "favorite")
 */

// =============================================================================
// Core Collection Types
// =============================================================================

/**
 * Collection Entity
 *
 * Represents a user's collection (playlist) of posts.
 * Can be public (discoverable by others) or private.
 */
export interface Collection {
  /** Unique collection identifier (UUID or "favorite" for virtual collection) */
  id: string;
  /** Collection name/title */
  name: string;
  /** Optional description of the collection */
  description?: string | null;
  /** Whether collection is publicly visible */
  is_public: boolean;
  /** Collection thumbnail/cover image URL */
  thumbnail_url?: string | null;
  /** Number of posts in the collection */
  posts_count: number;
  /** User-defined sort order (lower = higher priority) */
  sort_order: number;
  /** ISO timestamp when collection was created */
  created_at: string;
  /** ISO timestamp when collection was last updated */
  updated_at: string;
}

/**
 * Collection with ownership info
 *
 * Extended collection type that includes owner information.
 * Used when viewing public collections or collection details.
 */
export interface CollectionWithOwner extends Collection {
  user?: CollectionUser;
}

/**
 * Collection User (Owner)
 *
 * Minimal user information for collection ownership display.
 */
export interface CollectionUser {
  user_id: string;
  username: string;
  nickname: string;
  avatar?: string | null;
}

/**
 * Legacy Collection Type (UI Display)
 *
 * For backward compatibility with existing CollectionCard component.
 * Maps API response to UI-friendly format.
 *
 * @deprecated Use Collection interface directly with adapter functions
 */
export interface CollectionUI {
  id: string;
  title: string;
  imageUrl?: string;
  videoCount: number;
  isPublic: boolean;
  views?: string;
  isDefault?: boolean;
}

// =============================================================================
// Collection Item Types (Posts within Collection)
// =============================================================================

/**
 * Post File Information
 *
 * File metadata for a post's media content.
 */
export interface PostFile {
  size: string;
  type: string;
  width: number;
  height: number;
  suffix: string;
  duration?: number;
  thumbnail: string;
  resourceURL: string;
  downloadURL?: string;
}

/**
 * Post User (Author)
 *
 * User information for the post author.
 */
export interface PostUser {
  user_id: string;
  username: string;
  nickname: string;
  name?: string;
  avatar?: string | null;
  email?: string;
  phone?: string;
  status?: string;
  referral_code?: string;
}

/**
 * Collection Item (Post)
 *
 * Represents a post within a collection with full details.
 */
export interface CollectionItem {
  id: string;
  title: string;
  files: PostFile[];
  user?: PostUser;
  tag?: string[];
  /** ISO timestamp when post was added to collection */
  added_at?: string;
  /** Whether current user has favourited this post */
  is_favourite?: boolean;
  /** Total favourites count for this post */
  favourites_count?: number;
}

/**
 * Legacy Collection Item (UI Display)
 *
 * For backward compatibility with existing CollectionItemCard component.
 *
 * @deprecated Use CollectionItem interface directly with adapter functions
 */
export interface CollectionItemUI {
  id: string;
  title: string;
  imageUrl: string;
  typeDesc: string;
  episodes: number;
  rating: number;
  resolution?: string;
}

// =============================================================================
// API Request Types
// =============================================================================

/**
 * Create Collection Request (JSON)
 *
 * Use this when providing a thumbnail URL.
 */
export interface CreateCollectionRequest {
  name: string;
  description?: string;
  is_public?: boolean;
  thumbnail_url?: string;
  sort_order?: number;
}

/**
 * Create Collection Request with File Upload
 *
 * Use this when uploading a thumbnail file.
 * Will be converted to FormData for multipart/form-data request.
 */
export interface CreateCollectionWithFileRequest {
  name: string;
  description?: string;
  is_public?: boolean;
  /** Image file to upload (jpeg, jpg, png, gif, webp; max 5MB) */
  thumbnail?: File;
  sort_order?: number;
}

/**
 * Update Collection Request (JSON)
 *
 * Use this when providing a thumbnail URL.
 */
export interface UpdateCollectionRequest {
  collection_id: string;
  name?: string;
  description?: string;
  is_public?: boolean;
  thumbnail_url?: string;
  sort_order?: number;
}

/**
 * Update Collection Request with File Upload
 *
 * Use this when uploading a thumbnail file.
 * Will be converted to FormData for multipart/form-data request.
 */
export interface UpdateCollectionWithFileRequest {
  collection_id: string;
  name?: string;
  description?: string;
  is_public?: boolean;
  /** Image file to upload (jpeg, jpg, png, gif, webp; max 5MB) */
  thumbnail?: File;
  sort_order?: number;
}

/**
 * Delete Collection Request
 */
export interface DeleteCollectionRequest {
  collection_id: string;
}

/**
 * Add Post to Collection Request
 */
export interface AddPostToCollectionRequest {
  collection_id: string;
  post_id: string;
}

/**
 * Remove Post from Collection Request (single)
 */
export interface RemovePostFromCollectionRequest {
  collection_id: string;
  post_id: string;
}

/**
 * Remove Posts from Collection Request (batch)
 * Supports removing multiple posts at once
 */
export interface RemovePostsFromCollectionRequest {
  collection_id: string;
  post_id: string[];
}

/**
 * Add to Multiple Collections Request
 */
export interface AddToMultipleCollectionsRequest {
  post_id: string;
  collection_ids: string[];
}

/**
 * Reorder Posts Request
 */
export interface ReorderPostsRequest {
  collection_id: string;
  post_orders: Array<{
    post_id: string;
    sort_order: number;
  }>;
}

/**
 * Share Collection Request
 */
export interface ShareCollectionRequest {
  collection_id: string;
  is_public: boolean;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

/**
 * Collection List Query Parameters
 */
export interface CollectionListParams extends PaginationParams {}

/**
 * Collection Detail Query Parameters
 */
export interface CollectionDetailParams extends PaginationParams {
  collection_id: string;
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
 * API Error Response
 */
export interface ApiErrorResponse {
  status: boolean;
  message: string;
  data: null;
  error?: {
    code: string;
    detail: string;
  };
}

/**
 * Collection List Response Data
 */
export interface CollectionListData {
  collections: Collection[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

/**
 * Collection Detail Response Data
 */
export interface CollectionDetailData {
  collection: CollectionWithOwner;
  posts: CollectionItem[];
  total_posts: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

/**
 * Create Collection Response Data
 */
export interface CreateCollectionData {
  collection: Collection;
}

/**
 * Update Collection Response Data
 */
export interface UpdateCollectionData {
  collection: Collection;
}

/**
 * Delete Collection Response Data
 */
export interface DeleteCollectionData {
  deleted: boolean;
}

/**
 * Add Post Response Data
 */
export interface AddPostData {
  collection: {
    id: string;
    name: string;
    posts_count: number;
  };
  post: {
    id: string;
    title: string;
  };
  added_at: string;
}

/**
 * Remove Post Response Data (single)
 */
export interface RemovePostData {
  removed: boolean;
}

/**
 * Remove Posts Response Data (batch)
 */
export interface RemovePostsBatchData {
  removed: Array<{
    post_id: string;
  }>;
  failed: Array<{
    post_id: string;
    error: string;
  }>;
  removed_count: number;
  failed_count: number;
}

/**
 * Add to Multiple Collections Response Data
 */
export interface AddToMultipleData {
  added: Array<{
    collection_id: string;
    collection_name: string;
  }>;
  errors: Array<{
    collection_id: string;
    error: string;
  }>;
  added_count: number;
  error_count: number;
}

/**
 * Reorder Posts Response Data
 */
export interface ReorderPostsData {
  reordered: boolean;
}

/**
 * Share Collection Response Data
 */
export interface ShareCollectionData {
  collection: Collection;
}

/**
 * Public Collections List Data
 */
export interface PublicCollectionsData {
  collections: CollectionWithOwner[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

// =============================================================================
// Type Guard Functions
// =============================================================================

/**
 * Check if collection is the virtual "Favorite" collection
 */
export function isFavoriteCollection(collection: Collection): boolean {
  return collection.id === "favorite";
}

/**
 * Check if API response is an error
 */
export function isApiError(
  response: ApiResponse<unknown> | ApiErrorResponse
): response is ApiErrorResponse {
  return response.data === null && "error" in response;
}
