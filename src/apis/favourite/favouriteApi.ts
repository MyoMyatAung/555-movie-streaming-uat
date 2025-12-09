/**
 * Favourite API Client
 *
 * This module provides API client functions for the Favourite feature.
 * Favourites allow users to bookmark posts (movies/videos) for quick access.
 *
 * API Endpoints:
 * - POST /favourite/add - Add post to favourites
 * - POST /favourite/remove - Remove post from favourites
 * - GET /favourite/check - Check if post is favourited
 * - GET /favourite/list - Get user's favourite posts (paginated)
 *
 * @see API Documentation in api.md (Favourite API section)
 */

import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type {
  ApiResponse,
  FavouriteRequest,
  RemoveFavouriteRequest,
  CheckFavouriteParams,
  AddFavouriteData,
  RemoveFavouriteData,
  RemoveFavouriteBatchData,
  CheckFavouriteData,
  FavouriteListData,
} from "@/types/favourite";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =============================================================================
// Favourite Mutations
// =============================================================================

/**
 * Add post to favourites
 *
 * Adds a post to the user's favourites. A user can only favourite
 * a post once (database unique constraint).
 *
 * @param data - Request with post_id
 * @returns Promise resolving to favourite status and count
 *
 * @throws {AxiosError} 400 if already favourited, 404 if post not found
 *
 * @example
 * ```typescript
 * const response = await addFavourite({ post_id: "uuid" });
 * console.log(`Favourited! Total: ${response.data.favourites_count}`);
 * ```
 */
export async function addFavourite(
  data: FavouriteRequest
): Promise<ApiResponse<AddFavouriteData>> {
  const response = await AXIOS_CLIENT.post<ApiResponse<AddFavouriteData>>(
    `${API_BASE_URL}/favourite/add`,
    data
  );
  return response.data;
}

/**
 * Remove post from favourites (single)
 *
 * Removes a post from the user's favourites.
 * Only works if the post was previously favourited.
 *
 * @param data - Request with post_id
 * @returns Promise resolving to favourite status and count
 *
 * @throws {AxiosError} 404 if favourite not found
 *
 * @example
 * ```typescript
 * const response = await removeFavourite({ post_id: "uuid" });
 * console.log(`Removed! Total: ${response.data.favourites_count}`);
 * ```
 */
export async function removeFavourite(
  data: FavouriteRequest
): Promise<ApiResponse<RemoveFavouriteData>> {
  const response = await AXIOS_CLIENT.post<ApiResponse<RemoveFavouriteData>>(
    `${API_BASE_URL}/favourite/remove`,
    data
  );
  return response.data;
}

/**
 * Remove multiple posts from favourites (batch)
 *
 * Removes multiple posts from the user's favourites in a single request.
 * Supports partial success - some may succeed while others fail.
 *
 * @param data - Request with array of post_ids
 * @returns Promise resolving to batch removal results
 *
 * @example
 * ```typescript
 * const response = await removeFavouriteBatch({
 *   post_id: ["uuid-1", "uuid-2", "uuid-3"]
 * });
 * console.log(`Removed ${response.data.removed_count} favourites`);
 * if (response.data.failed_count > 0) {
 *   console.log("Some removals failed:", response.data.failed);
 * }
 * ```
 */
export async function removeFavouriteBatch(
  data: RemoveFavouriteRequest
): Promise<ApiResponse<RemoveFavouriteBatchData>> {
  const response = await AXIOS_CLIENT.post<ApiResponse<RemoveFavouriteBatchData>>(
    `${API_BASE_URL}/favourite/remove`,
    data
  );
  return response.data;
}

/**
 * Check if post is favourited
 *
 * Checks whether the current user has favourited a specific post.
 * Also returns the total favourites count for the post.
 *
 * @param params - Query params with post_id
 * @returns Promise resolving to favourite status and count
 *
 * @example
 * ```typescript
 * const response = await checkFavourite({ post_id: "uuid" });
 * if (response.data.is_favourite) {
 *   console.log("This post is in your favourites");
 * }
 * ```
 */
export async function checkFavourite(
  params: CheckFavouriteParams
): Promise<ApiResponse<CheckFavouriteData>> {
  const response = await AXIOS_CLIENT.get<ApiResponse<CheckFavouriteData>>(
    `${API_BASE_URL}/favourite/check`,
    { params }
  );
  return response.data;
}

// =============================================================================
// Favourite Queries
// =============================================================================

/**
 * Legacy type alias for backward compatibility
 * @deprecated Use ApiResponse<FavouriteListData> instead
 */
export interface GetFavouriteListResponse {
  status: boolean;
  message: string;
  data: {
    favourites: unknown[];
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
}

/**
 * Get Favourite Count
 *
 * Fetches the user's favourite list to extract the total count.
 * Only fetches the first page with minimal items since we only
 * need the total count for display purposes.
 *
 * Performance Optimization:
 * - Requests only 1 item per page (we don't use the data)
 * - API still returns correct total count in pagination metadata
 * - Reduces payload size and transfer time
 *
 * @returns Promise with favourite list response (including total count)
 *
 * @throws {AxiosError} When request fails (network error, auth error, etc.)
 *
 * @example
 * ```typescript
 * const response = await getFavouriteCountApi();
 * const count = response.data.total;
 * console.log(`User has ${count} favourites`);
 * ```
 */
export async function getFavouriteCountApi(): Promise<GetFavouriteListResponse> {
  const response = await AXIOS_CLIENT.get<GetFavouriteListResponse>(
    `${API_BASE_URL}/favourite/list`,
    {
      params: {
        page: 1,
        per_page: 1, // Minimal payload - we only need the total count
      },
    }
  );
  return response.data;
}

/**
 * Get favourite list with pagination
 *
 * Fetches the user's favourited posts with full details.
 * Supports pagination for large lists.
 *
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 20, max: 100)
 * @returns Promise with paginated favourite list
 *
 * @example
 * ```typescript
 * const response = await getFavouriteList(1, 20);
 * response.data.favourites.forEach(post => {
 *   console.log(post.title);
 * });
 * ```
 */
export async function getFavouriteList(
  page: number = 1,
  perPage: number = 20
): Promise<ApiResponse<FavouriteListData>> {
  const response = await AXIOS_CLIENT.get<ApiResponse<FavouriteListData>>(
    `${API_BASE_URL}/favourite/list`,
    {
      params: { page, per_page: perPage },
    }
  );
  return response.data;
}

