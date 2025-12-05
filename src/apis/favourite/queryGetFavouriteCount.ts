/**
 * React Query Hook: Get Favourite Count
 * 
 * This hook provides a lightweight interface for fetching the user's
 * favourite count. Used primarily for the default "Favorites" collection
 * display in the collection list.
 * 
 * Features:
 * - Minimal API payload (only fetches 1 item to get count)
 * - Automatic caching (5 minutes)
 * - Type-safe data access
 * - Loading and error state management
 * 
 * Cache Strategy:
 * - Query Key: ['favourite', 'count']
 * - Stale Time: 5 minutes (same as collections)
 * - Cache Time: 10 minutes
 * - Refetch on window focus: Disabled
 * 
 * Performance:
 * - Lightweight query (per_page=1 for minimal payload)
 * - Cached result used across components
 * - Automatic invalidation when favourites change
 * 
 * @see favouriteApi.ts for the underlying API function
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getFavouriteCountApi, type GetFavouriteListResponse } from "./favouriteApi";

/**
 * Query Key Factory
 * 
 * Generates consistent query keys for React Query cache management.
 */
export const favouriteCountQueryKey = () => ["favourite", "count"] as const;

/**
 * useFavouriteCount Hook
 * 
 * React Query hook for fetching user's favourite count.
 * Returns the total number of favourited posts.
 * 
 * @param options - React Query options for customization
 * 
 * @returns React Query result with favourite count, loading state, and error
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { data, isLoading } = useFavouriteCount();
 * 
 * if (isLoading) return <Loading />;
 * 
 * const count = data?.data.total ?? 0;
 * console.log(`User has ${count} favourites`);
 * ```
 * 
 * @example With Custom Options
 * ```typescript
 * const { data } = useFavouriteCount({
 *   enabled: isAuthenticated, // Only fetch when authenticated
 *   onSuccess: (data) => {
 *     console.log('Favourite count:', data.data.total);
 *   },
 * });
 * ```
 * 
 * @example Error Handling
 * ```typescript
 * const { data, error, isError } = useFavouriteCount();
 * 
 * if (isError) {
 *   console.error('Failed to fetch favourite count:', error);
 *   // Fallback to 0
 *   const count = 0;
 * }
 * ```
 */
export function useFavouriteCount(
  options?: Omit<
    UseQueryOptions<GetFavouriteListResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<GetFavouriteListResponse, Error>({
    queryKey: favouriteCountQueryKey(),
    queryFn: getFavouriteCountApi,
    staleTime: 5 * 60 * 1000, // 5 minutes (same as collections)
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2, // Retry failed requests twice
    ...options,
  });
}

/**
 * Helper: Extract Favourite Count from Response
 * 
 * Safely extracts the favourite count from the API response.
 * Returns 0 if data is undefined (loading or error state).
 * 
 * @param data - Favourite list response data
 * @returns Total number of favourites (0 if undefined)
 * 
 * @example
 * ```typescript
 * const { data } = useFavouriteCount();
 * const count = getFavouriteCount(data);
 * // count is always a number (never undefined)
 * ```
 */
export function getFavouriteCount(
  data: GetFavouriteListResponse | undefined
): number {
  return data?.data.total ?? 0;
}

