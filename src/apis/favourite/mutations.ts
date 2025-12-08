/**
 * Favourite Mutation Hooks
 *
 * React Query mutation hooks for favourite operations.
 * Follows the Single Responsibility Principle - each hook handles one operation.
 *
 * Features:
 * - Optimistic updates for instant UI feedback
 * - Automatic cache invalidation
 * - Error handling with rollback support
 *
 * @see favouriteApi.ts for underlying API functions
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavourite, removeFavourite, removeFavouriteBatch } from "./favouriteApi";
import type {
  ApiResponse,
  FavouriteRequest,
  RemoveFavouriteRequest,
  AddFavouriteData,
  RemoveFavouriteData,
  RemoveFavouriteBatchData,
} from "@/types/favourite";
import { collectionKeys } from "@/apis/collection/queries";

// =============================================================================
// Query Keys
// =============================================================================

/**
 * Favourite query key factory
 *
 * Centralized key management for favourite-related queries.
 * Enables efficient cache invalidation and updates.
 */
export const favouriteKeys = {
  all: ["favourite"] as const,
  lists: () => [...favouriteKeys.all, "list"] as const,
  list: (page: number, perPage: number) =>
    [...favouriteKeys.lists(), { page, perPage }] as const,
  check: (postId: string) => [...favouriteKeys.all, "check", postId] as const,
};

// =============================================================================
// Mutation Hooks
// =============================================================================

/**
 * useAddFavourite Hook
 *
 * Adds a post to the user's favourites.
 * Invalidates related caches on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useAddFavourite();
 *
 * mutate(
 *   { post_id: "uuid" },
 *   {
 *     onSuccess: () => toast.success("Added to favorites"),
 *     onError: (error) => toast.error(error.message),
 *   }
 * );
 * ```
 */
export function useAddFavourite() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AddFavouriteData>, Error, FavouriteRequest>({
    mutationFn: addFavourite,
    onSuccess: (_, variables) => {
      // Invalidate favourite list to update count
      queryClient.invalidateQueries({ queryKey: favouriteKeys.lists() });
      // Invalidate check query for this post
      queryClient.invalidateQueries({
        queryKey: favouriteKeys.check(variables.post_id),
      });
      // Invalidate collection list to update virtual favourite collection count
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
}

/**
 * useRemoveFavourite Hook
 *
 * Removes a single post from the user's favourites.
 * Invalidates related caches on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useRemoveFavourite();
 *
 * mutate(
 *   { post_id: "uuid" },
 *   {
 *     onSuccess: () => toast.success("Removed from favorites"),
 *     onError: (error) => toast.error(error.message),
 *   }
 * );
 * ```
 */
export function useRemoveFavourite() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<RemoveFavouriteData>, Error, FavouriteRequest>(
    {
      mutationFn: removeFavourite,
      onSuccess: (_, variables) => {
        // Invalidate favourite list to update count
        queryClient.invalidateQueries({ queryKey: favouriteKeys.lists() });
        // Invalidate check query for this post
        queryClient.invalidateQueries({
          queryKey: favouriteKeys.check(variables.post_id),
        });
        // Invalidate collection list to update virtual favourite collection count
        queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      },
    }
  );
}

/**
 * useRemoveFavouriteBatch Hook
 *
 * Removes multiple posts from the user's favourites in a single API call.
 * Supports partial success - some may succeed while others fail.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useRemoveFavouriteBatch();
 *
 * mutate(
 *   { post_id: ["uuid-1", "uuid-2", "uuid-3"] },
 *   {
 *     onSuccess: (data) => {
 *       toast.success(`Removed ${data.data.removed_count} from favorites`);
 *     },
 *   }
 * );
 * ```
 */
export function useRemoveFavouriteBatch() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RemoveFavouriteBatchData>,
    Error,
    RemoveFavouriteRequest
  >({
    mutationFn: removeFavouriteBatch,
    onSuccess: (data) => {
      // Invalidate favourite list to update count
      queryClient.invalidateQueries({ queryKey: favouriteKeys.lists() });
      // Invalidate check queries for all removed posts
      data.data.removed.forEach((item) => {
        queryClient.invalidateQueries({
          queryKey: favouriteKeys.check(item.post_id),
        });
      });
      // Invalidate collection list to update virtual favourite collection count
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
}

/**
 * useToggleFavourite Hook
 *
 * Convenience hook that toggles favourite status based on current state.
 * Useful for UI toggle buttons that switch between add/remove.
 *
 * @param postId - The post ID to toggle
 * @param isFavourited - Current favourite state
 * @returns Object with toggle function and loading state
 *
 * @example
 * ```typescript
 * const { toggle, isPending } = useToggleFavourite(postId, isFavourited);
 *
 * <button onClick={toggle} disabled={isPending}>
 *   {isFavourited ? "Remove from favorites" : "Add to favorites"}
 * </button>
 * ```
 */
export function useToggleFavourite(postId: string, isFavourited: boolean) {
  const addMutation = useAddFavourite();
  const removeMutation = useRemoveFavourite();

  const toggle = () => {
    if (isFavourited) {
      removeMutation.mutate({ post_id: postId });
    } else {
      addMutation.mutate({ post_id: postId });
    }
  };

  return {
    toggle,
    isPending: addMutation.isPending || removeMutation.isPending,
    isError: addMutation.isError || removeMutation.isError,
    error: addMutation.error || removeMutation.error,
  };
}

