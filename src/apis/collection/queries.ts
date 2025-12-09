/**
 * Collection Query Hooks
 *
 * React Query hooks for fetching collection data.
 * Follows the Open/Closed Principle - open for extension via options parameter.
 *
 * Cache Strategy:
 * - Query Key: ['collection', ...params] for proper cache invalidation
 * - Stale Time: 5 minutes (balances freshness with performance)
 * - Cache Time: 10 minutes
 *
 * @see collectionApi.ts for underlying API functions
 */

import { useQuery, useInfiniteQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  getCollectionList,
  getCollectionDetail,
  getPublicCollections,
} from "./collectionApi";
import type {
  ApiResponse,
  CollectionListData,
  CollectionDetailData,
  PublicCollectionsData,
  CollectionListParams,
  CollectionDetailParams,
  PaginationParams,
} from "@/types/collection";

// =============================================================================
// Query Key Factory
// =============================================================================

/**
 * Query Key Factory for Collections
 *
 * Provides consistent query keys for React Query cache management.
 * Keys are structured hierarchically for efficient invalidation.
 */
export const collectionKeys = {
  /** Base key for all collection queries */
  all: ["collection"] as const,
  /** Key for collection list queries */
  lists: () => [...collectionKeys.all, "list"] as const,
  /** Key for specific collection list with params */
  list: (params: CollectionListParams) =>
    [...collectionKeys.lists(), params] as const,
  /** Key for collection detail queries */
  details: () => [...collectionKeys.all, "detail"] as const,
  /** Key for specific collection detail */
  detail: (id: string) => [...collectionKeys.details(), id] as const,
  /** Key for public collections queries */
  public: () => [...collectionKeys.all, "public"] as const,
  /** Key for specific public collections page */
  publicList: (params: PaginationParams) =>
    [...collectionKeys.public(), params] as const,
};

// =============================================================================
// Collection List Query
// =============================================================================

/**
 * useCollectionList Hook
 *
 * Fetches the authenticated user's collections list.
 * Includes virtual "Favorite" collection as first item.
 *
 * @param params - Pagination parameters
 * @param options - React Query options for customization
 *
 * @returns Query result with collections, loading state, and error
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { data, isLoading, error } = useCollectionList();
 *
 * // With pagination
 * const { data } = useCollectionList({ page: 2, per_page: 10 });
 *
 * // With custom options
 * const { data } = useCollectionList({}, {
 *   enabled: isAuthenticated,
 *   refetchInterval: 30000,
 * });
 * ```
 */
export function useCollectionList(
  params: CollectionListParams = {},
  options?: Omit<
    UseQueryOptions<ApiResponse<CollectionListData>, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<ApiResponse<CollectionListData>, Error>({
    queryKey: collectionKeys.list(params),
    queryFn: () => getCollectionList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
}

// =============================================================================
// Collection Detail Query
// =============================================================================

/**
 * useCollectionDetail Hook
 *
 * Fetches a collection's details with its posts.
 * Works for both user's own collections and public collections.
 *
 * @param params - Query params with collection_id and pagination
 * @param options - React Query options for customization
 *
 * @returns Query result with collection details and posts
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { data, isLoading } = useCollectionDetail({
 *   collection_id: "uuid-here",
 * });
 *
 * // With pagination
 * const { data } = useCollectionDetail({
 *   collection_id: "uuid-here",
 *   page: 1,
 *   per_page: 20,
 * });
 * ```
 */
export function useCollectionDetail(
  params: CollectionDetailParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<CollectionDetailData>, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<ApiResponse<CollectionDetailData>, Error>({
    queryKey: collectionKeys.detail(params.collection_id),
    queryFn: () => getCollectionDetail(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!params.collection_id,
    ...options,
  });
}

/**
 * useInfiniteCollectionDetail Hook
 *
 * Infinite scroll support for collection posts.
 * Automatically loads more posts when reaching the end.
 *
 * @param collectionId - Collection ID to fetch
 * @param perPage - Number of posts per page
 *
 * @returns Infinite query result with pagination helpers
 *
 * @example
 * ```typescript
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 * } = useInfiniteCollectionDetail("collection-uuid", 20);
 *
 * // Access all posts
 * const allPosts = data?.pages.flatMap(page => page.data.posts) ?? [];
 *
 * // Load more
 * if (hasNextPage) {
 *   fetchNextPage();
 * }
 * ```
 */
export function useInfiniteCollectionDetail(
  collectionId: string,
  perPage: number = 20
) {
  return useInfiniteQuery({
    queryKey: [...collectionKeys.detail(collectionId), "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      getCollectionDetail({
        collection_id: collectionId,
        page: pageParam as number,
        per_page: perPage,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.data;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!collectionId,
  });
}

// =============================================================================
// Public Collections Query
// =============================================================================

/**
 * usePublicCollections Hook
 *
 * Fetches public collections from all users.
 * Works with or without authentication.
 *
 * @param params - Pagination parameters
 * @param options - React Query options for customization
 *
 * @returns Query result with public collections
 *
 * @example
 * ```typescript
 * const { data, isLoading } = usePublicCollections({ page: 1 });
 *
 * data?.data.collections.forEach(collection => {
 *   console.log(`${collection.name} by ${collection.user?.nickname}`);
 * });
 * ```
 */
export function usePublicCollections(
  params: PaginationParams = {},
  options?: Omit<
    UseQueryOptions<ApiResponse<PublicCollectionsData>, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<ApiResponse<PublicCollectionsData>, Error>({
    queryKey: collectionKeys.publicList(params),
    queryFn: () => getPublicCollections(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extract collections array from query response
 *
 * @param data - Query response data
 * @returns Collections array or empty array if undefined
 */
export function getCollections(
  data: ApiResponse<CollectionListData> | undefined
) {
  return data?.data.collections ?? [];
}

/**
 * Extract collection detail from query response
 *
 * @param data - Query response data
 * @returns Collection object or undefined
 */
export function getCollectionFromDetail(
  data: ApiResponse<CollectionDetailData> | undefined
) {
  return data?.data.collection;
}

/**
 * Extract posts from collection detail response
 *
 * @param data - Query response data
 * @returns Posts array or empty array if undefined
 */
export function getCollectionPosts(
  data: ApiResponse<CollectionDetailData> | undefined
) {
  return data?.data.posts ?? [];
}

