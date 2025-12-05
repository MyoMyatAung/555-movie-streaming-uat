/**
 * React Query Mutation for Comment Reactions (Like/Unlike)
 * 
 * This module provides React Query mutation hooks for liking and unliking comments.
 * It implements optimistic updates for instant UI feedback while the request is in flight.
 * 
 * Design Principles:
 * - Single Responsibility: Each hook handles one specific action (like or unlike)
 * - Open/Closed: Extensible through options without modifying existing code
 * - Dependency Inversion: Depends on abstractions (query client) not implementations
 * 
 * Features:
 * - Optimistic updates for instant feedback
 * - Automatic cache synchronization
 * - Rollback on error
 * - Type-safe error handling
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeComment, unlikeComment } from "./commentApi";
import { commentsKeys } from "./queryGetComments";
import type {
  CommentReactionRequest,
  CommentReactionResponse,
  CommentsListResponse,
  Comment,
} from "@/types/comment";

/**
 * Configuration options for comment reaction mutations
 * 
 * These options allow consumers to hook into the mutation lifecycle
 * for custom behavior like showing toasts, tracking analytics, etc.
 */
interface UseCommentReactionOptions {
  /**
   * Callback invoked when the mutation succeeds
   * @param data - The response from the API with updated like state
   */
  onSuccess?: (data: CommentReactionResponse) => void;
  
  /**
   * Callback invoked when the mutation fails
   * @param error - The error object with response data
   */
  onError?: (error: any) => void;
}

/**
 * Context stored during optimistic update for potential rollback
 * Preserves the previous cache state to restore on error
 */
interface OptimisticContext {
  previousData: CommentsListResponse | undefined;
}

/**
 * Helper function to update comment like state in cached data
 * 
 * This function performs an immutable update on the cached comments list,
 * updating the specific comment's like state and count.
 * 
 * @param data - The current cached comments data
 * @param commentId - The ID of the comment to update
 * @param liked - The new liked state
 * @param likeCountDelta - The change in like count (+1 for like, -1 for unlike)
 * @returns New comments data with updated like state
 */
const updateCommentLikeState = (
  data: CommentsListResponse,
  commentId: string,
  liked: boolean,
  likeCountDelta: number,
): CommentsListResponse => {
  return {
    ...data,
    data: {
      ...data.data,
      list: data.data.list.map((comment: Comment) => {
        // Update the target comment
        if (comment.comment_id === commentId) {
          return {
            ...comment,
            is_liked: liked,
            comment_like_count: Math.max(0, comment.comment_like_count + likeCountDelta),
          };
        }
        return comment;
      }),
    },
  };
};

/**
 * Custom hook for liking a comment
 * 
 * This mutation hook provides:
 * - Optimistic UI update (instant like feedback)
 * - Automatic cache invalidation on success
 * - Rollback mechanism on error
 * - Type-safe response handling
 * 
 * Error Handling:
 * - 400: Already liked - Revert optimistic update
 * - 401: Unauthenticated - Show login prompt
 * - 404: Comment not found - Show error message
 * 
 * @param postId - The post ID containing the comment (for cache key)
 * @param options - Optional callbacks for success/error handling
 * @returns Mutation object with mutate, isPending, error, etc.
 * 
 * @example
 * ```typescript
 * const likeCommentMutation = useMutationLikeComment("post-123", {
 *   onSuccess: (data) => {
 *     toast.success("Comment liked!");
 *   },
 *   onError: (error) => {
 *     if (error.response?.status === 400) {
 *       toast.info("You've already liked this comment");
 *     }
 *   }
 * });
 * 
 * // Like a comment
 * likeCommentMutation.mutate({ comment_id: "comment-456" });
 * ```
 */
export const useMutationLikeComment = (
  postId: string,
  options?: UseCommentReactionOptions,
) => {
  const queryClient = useQueryClient();
  const queryKey = commentsKeys.byPost(postId);

  return useMutation<CommentReactionResponse, any, CommentReactionRequest, OptimisticContext>({
    mutationFn: likeComment,

    /**
     * Optimistic Update: Immediately update UI before server response
     * This provides instant feedback to the user
     */
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value for potential rollback
      const previousData = queryClient.getQueryData<CommentsListResponse>(queryKey);

      // Optimistically update the cache
      if (previousData) {
        queryClient.setQueryData<CommentsListResponse>(
          queryKey,
          updateCommentLikeState(previousData, variables.comment_id, true, 1),
        );
      }

      // Return context with previous data for rollback
      return { previousData };
    },

    /**
     * On success, sync cache with server response and invalidate query
     * The server response contains the accurate like_count
     * 
     * Process:
     * 1. Update local cache with server response
     * 2. Invalidate query to refetch fresh data
     * 3. Call custom success callback
     */
    onSuccess: async (data, variables) => {
      // Update cache with accurate server data
      const currentData = queryClient.getQueryData<CommentsListResponse>(queryKey);
      if (currentData) {
        queryClient.setQueryData<CommentsListResponse>(queryKey, {
          ...currentData,
          data: {
            ...currentData.data,
            list: currentData.data.list.map((comment: Comment) => {
              if (comment.comment_id === variables.comment_id) {
                return {
                  ...comment,
                  is_liked: data.data.liked,
                  comment_like_count: data.data.like_count,
                };
              }
              return comment;
            }),
          },
        });
      }

      // Invalidate the query to ensure fresh data from server
      // This refetches the comments to get any updates we might have missed
      await queryClient.invalidateQueries({ queryKey });

      // Call custom success callback
      options?.onSuccess?.(data);
    },

    /**
     * On error, rollback to previous state
     * This ensures UI consistency when the request fails
     */
    onError: (error, _variables, context) => {
      // Rollback to previous data if available
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      console.error("Failed to like comment:", error);
      options?.onError?.(error);
    },
  });
};

/**
 * Custom hook for unliking a comment
 * 
 * This mutation hook provides:
 * - Optimistic UI update (instant unlike feedback)
 * - Automatic cache invalidation on success
 * - Rollback mechanism on error
 * - Type-safe response handling
 * 
 * Error Handling:
 * - 400: Not liked - Revert optimistic update (user hasn't liked this comment)
 * - 401: Unauthenticated - Show login prompt
 * - 404: Comment not found - Show error message
 * 
 * @param postId - The post ID containing the comment (for cache key)
 * @param options - Optional callbacks for success/error handling
 * @returns Mutation object with mutate, isPending, error, etc.
 * 
 * @example
 * ```typescript
 * const unlikeCommentMutation = useMutationUnlikeComment("post-123", {
 *   onSuccess: (data) => {
 *     toast.info("Like removed");
 *   },
 *   onError: (error) => {
 *     if (error.response?.status === 400) {
 *       toast.error("You haven't liked this comment");
 *     }
 *   }
 * });
 * 
 * // Unlike a comment
 * unlikeCommentMutation.mutate({ comment_id: "comment-456" });
 * ```
 */
export const useMutationUnlikeComment = (
  postId: string,
  options?: UseCommentReactionOptions,
) => {
  const queryClient = useQueryClient();
  const queryKey = commentsKeys.byPost(postId);

  return useMutation<CommentReactionResponse, any, CommentReactionRequest, OptimisticContext>({
    mutationFn: unlikeComment,

    /**
     * Optimistic Update: Immediately update UI before server response
     * This provides instant feedback to the user
     */
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value for potential rollback
      const previousData = queryClient.getQueryData<CommentsListResponse>(queryKey);

      // Optimistically update the cache
      if (previousData) {
        queryClient.setQueryData<CommentsListResponse>(
          queryKey,
          updateCommentLikeState(previousData, variables.comment_id, false, -1),
        );
      }

      // Return context with previous data for rollback
      return { previousData };
    },

    /**
     * On success, sync cache with server response and invalidate query
     * The server response contains the accurate like_count
     * 
     * Process:
     * 1. Update local cache with server response
     * 2. Invalidate query to refetch fresh data
     * 3. Call custom success callback
     */
    onSuccess: async (data, variables) => {
      // Update cache with accurate server data
      const currentData = queryClient.getQueryData<CommentsListResponse>(queryKey);
      if (currentData) {
        queryClient.setQueryData<CommentsListResponse>(queryKey, {
          ...currentData,
          data: {
            ...currentData.data,
            list: currentData.data.list.map((comment: Comment) => {
              if (comment.comment_id === variables.comment_id) {
                return {
                  ...comment,
                  is_liked: data.data.liked,
                  comment_like_count: data.data.like_count,
                };
              }
              return comment;
            }),
          },
        });
      }

      // Invalidate the query to ensure fresh data from server
      // This refetches the comments to get any updates we might have missed
      await queryClient.invalidateQueries({ queryKey });

      // Call custom success callback
      options?.onSuccess?.(data);
    },

    /**
     * On error, rollback to previous state
     * This ensures UI consistency when the request fails
     */
    onError: (error, _variables, context) => {
      // Rollback to previous data if available
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      console.error("Failed to unlike comment:", error);
      options?.onError?.(error);
    },
  });
};

/**
 * Combined hook for toggling comment like state
 * 
 * This is a convenience hook that automatically determines whether to
 * like or unlike based on the current state. It provides a simpler API
 * when you just want to toggle the like state.
 * 
 * @param postId - The post ID containing the comment (for cache key)
 * @param options - Optional callbacks for success/error handling
 * @returns Object with toggleLike function and loading states
 * 
 * @example
 * ```typescript
 * const { toggleLike, isLiking, isUnliking } = useToggleCommentLike("post-123", {
 *   onSuccess: () => toast.success("Updated!"),
 *   onError: () => toast.error("Failed to update")
 * });
 * 
 * // Toggle like state
 * toggleLike({ comment_id: "comment-456", isCurrentlyLiked: true });
 * ```
 */
export const useToggleCommentLike = (
  postId: string,
  options?: UseCommentReactionOptions,
) => {
  const likeMutation = useMutationLikeComment(postId, options);
  const unlikeMutation = useMutationUnlikeComment(postId, options);

  /**
   * Toggle the like state of a comment
   * Automatically calls like or unlike based on current state
   * 
   * @param params - Object containing comment_id and current liked state
   */
  const toggleLike = ({
    comment_id,
    isCurrentlyLiked,
  }: {
    comment_id: string;
    isCurrentlyLiked: boolean;
  }) => {
    if (isCurrentlyLiked) {
      unlikeMutation.mutate({ comment_id });
    } else {
      likeMutation.mutate({ comment_id });
    }
  };

  return {
    toggleLike,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
    isPending: likeMutation.isPending || unlikeMutation.isPending,
    likeError: likeMutation.error,
    unlikeError: unlikeMutation.error,
  };
};

