/**
 * React Query Hook for Fetching Comments
 * 
 * This module provides a React Query hook for fetching and caching comments.
 * It implements the Dependency Inversion Principle by depending on abstractions (query options)
 * rather than concrete implementations.
 * 
 * Features:
 * - Automatic caching and background refetching
 * - Cursor-based pagination support
 * - Stale-while-revalidate pattern for better UX
 * - Optimistic updates when combined with mutations
 */

import { queryOptions } from "@tanstack/react-query";
import { fetchComments } from "./commentApi";
import type { FetchCommentsParams } from "@/types/comment";

/**
 * Cache key factory for comments queries
 * 
 * Using a consistent key structure allows for:
 * - Easy cache invalidation
 * - Efficient refetching of related data
 * - Better debugging and DevTools experience
 * 
 * @param postId - The post ID to fetch comments for
 * @param params - Additional query parameters (pagination, etc.)
 * @returns Query key array for React Query
 */
export const commentsKeys = {
  all: ["comments"] as const,
  byPost: (postId: string) => [...commentsKeys.all, postId] as const,
  byPostWithParams: (postId: string, params?: Omit<FetchCommentsParams, "post_id">) =>
    [...commentsKeys.byPost(postId), params] as const,
};

/**
 * Creates query options for fetching comments
 * 
 * This function returns query options that can be used with:
 * - useQuery for regular data fetching
 * - useSuspenseQuery for Suspense-based data fetching
 * - useInfiniteQuery for infinite scroll pagination
 * 
 * Caching Strategy:
 * - staleTime: 30 seconds - Data is considered fresh for 30s
 * - gcTime: 5 minutes - Unused data is garbage collected after 5 min
 * 
 * @param params - Query parameters including post_id and optional pagination
 * @returns Query options object for React Query
 * 
 * @example
 * ```typescript
 * // In a component
 * const { data, isLoading } = useQuery(queryGetComments({ post_id: "123" }));
 * 
 * // With Suspense
 * const { data } = useSuspenseQuery(queryGetComments({ post_id: "123", limit: 10 }));
 * ```
 */
export const queryGetComments = (params: FetchCommentsParams) => {
  const { post_id, ...restParams } = params;
  
  return queryOptions({
    queryKey: commentsKeys.byPostWithParams(post_id, restParams),
    queryFn: () => fetchComments(params),
    staleTime: 1000 * 30, // 30 seconds - comments update frequently
    gcTime: 1000 * 60 * 5, // 5 minutes - keep in cache for quick navigation
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
};

