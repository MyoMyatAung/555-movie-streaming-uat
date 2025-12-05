/**
 * React Query Configuration for Fetching Problem Types
 * 
 * This module provides React Query configuration for fetching problem types.
 * It follows the Factory Pattern to create query configurations that can be
 * used with useQuery or useSuspenseQuery hooks.
 * 
 * Features:
 * - Cached data for 5 minutes (problem types rarely change)
 * - Automatic refetching on window focus
 * - Type-safe query keys and responses
 * 
 * @see feedbackApi.ts for the underlying API call
 */

import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchProblemTypes } from "./feedbackApi";
import type { ProblemTypesListResponse } from "@/types/feedback";

/**
 * Query key factory for problem types
 * 
 * Provides consistent query key generation for:
 * - Cache management
 * - Query invalidation
 * - Query prefetching
 * 
 * @example
 * ```typescript
 * // Invalidate all problem types queries
 * queryClient.invalidateQueries({ queryKey: problemTypesKeys.all });
 * 
 * // Invalidate just the list query
 * queryClient.invalidateQueries({ queryKey: problemTypesKeys.list() });
 * ```
 */
export const problemTypesKeys = {
  /** Base key for all problem types queries */
  all: ["problemTypes"] as const,
  
  /** Key for the problem types list query */
  list: () => [...problemTypesKeys.all, "list"] as const,
} as const;

/**
 * Query options factory for fetching problem types
 * 
 * Creates a query configuration object that can be used with:
 * - useQuery() for standard data fetching
 * - useSuspenseQuery() for Suspense-based loading
 * - queryClient.prefetchQuery() for prefetching
 * 
 * Configuration:
 * - staleTime: 5 minutes (problem types change infrequently)
 * - gcTime: 30 minutes (keep in cache even when inactive)
 * 
 * @returns Query options object compatible with React Query hooks
 * 
 * @example
 * ```typescript
 * // With useQuery
 * const { data, isLoading, error } = useQuery(queryGetProblemTypes());
 * 
 * // With useSuspenseQuery (automatic loading handling)
 * const { data } = useSuspenseQuery(queryGetProblemTypes());
 * 
 * // Prefetching for improved UX
 * await queryClient.prefetchQuery(queryGetProblemTypes());
 * ```
 */
export const queryGetProblemTypes = () =>
  queryOptions<ProblemTypesListResponse>({
    queryKey: problemTypesKeys.list(),
    queryFn: fetchProblemTypes,
    
    /**
     * Problem types rarely change, so we can cache them for longer.
     * This reduces unnecessary API calls and improves performance.
     */
    staleTime: 5 * 60 * 1000, // 5 minutes
    
    /**
     * Keep data in garbage collection for 30 minutes.
     * This allows instant display when reopening the feedback sheet.
     */
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

/**
 * Custom hook for fetching problem types with automatic state management
 * 
 * This hook wraps useQuery with the queryGetProblemTypes configuration,
 * providing a convenient way to fetch problem types with all React Query
 * benefits (caching, automatic refetching, loading states, etc.).
 * 
 * @returns Query result object with data, loading, and error states
 * 
 * @example
 * ```typescript
 * function FeedbackForm() {
 *   const { data, isLoading, isError, error, refetch } = useGetProblemTypes();
 * 
 *   if (isLoading) return <LoadingSpinner />;
 *   if (isError) return <ErrorMessage error={error} />;
 * 
 *   return (
 *     <ProblemTypeSelector 
 *       problemTypes={data.data} 
 *       onRefresh={refetch}
 *     />
 *   );
 * }
 * ```
 */
export const useGetProblemTypes = () => {
  return useQuery(queryGetProblemTypes());
};

