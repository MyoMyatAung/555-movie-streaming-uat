/**
 * Favourite Query Hooks
 *
 * React Query hooks for fetching favourite data.
 * Provides caching, background refetching, and loading states.
 *
 * @see favouriteApi.ts for underlying API functions
 */

import { useQuery } from "@tanstack/react-query";
import { checkFavourite, getFavouriteList } from "./favouriteApi";
import { favouriteKeys } from "./mutations";

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * useCheckFavourite Hook
 *
 * Checks if a specific post is in the user's favourites.
 * Useful for showing favourite status on post cards and detail pages.
 *
 * @param postId - The post ID to check
 * @param options - Optional query options (enabled, staleTime, etc.)
 * @returns Query result with favourite status
 *
 * @example
 * ```typescript
 * const { data, isLoading } = useCheckFavourite(postId);
 *
 * if (data?.data.is_favourite) {
 *   // Show filled heart icon
 * }
 * ```
 */
export function useCheckFavourite(
  postId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: favouriteKeys.check(postId),
    queryFn: () => checkFavourite({ post_id: postId }),
    enabled: options?.enabled !== false && !!postId,
    staleTime: 30 * 1000, // Consider fresh for 30 seconds
  });
}

/**
 * useFavouriteList Hook
 *
 * Fetches the user's favourited posts with pagination.
 *
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 20)
 * @returns Query result with paginated favourite list
 *
 * @example
 * ```typescript
 * const { data, isLoading } = useFavouriteList(1, 20);
 *
 * data?.data.favourites.map(post => (
 *   <PostCard key={post.id} post={post} />
 * ));
 * ```
 */
export function useFavouriteList(page: number = 1, perPage: number = 20) {
  return useQuery({
    queryKey: favouriteKeys.list(page, perPage),
    queryFn: () => getFavouriteList(page, perPage),
    staleTime: 60 * 1000, // Consider fresh for 1 minute
  });
}

