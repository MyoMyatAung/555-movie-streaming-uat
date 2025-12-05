/**
 * React Query Mutation for Creating Comments
 * 
 * This module provides a React Query mutation hook for creating comments and replies.
 * It follows the Command Pattern by encapsulating comment creation as an operation.
 * 
 * Features:
 * - Automatic cache invalidation on success
 * - Error handling with type-safe error responses
 * - Optimistic updates support
 * - Loading and error states management
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "./commentApi";
import { commentsKeys } from "./queryGetComments";

/**
 * Configuration options for the create comment mutation
 * 
 * These options allow consumers to hook into the mutation lifecycle
 * for custom behavior like showing toasts, tracking analytics, etc.
 */
interface UseCreateCommentOptions {
  /**
   * Callback invoked when the mutation succeeds
   * Useful for showing success messages or redirecting
   */
  onSuccess?: () => void;
  
  /**
   * Callback invoked when the mutation fails
   * Useful for showing error messages or logging
   * 
   * @param error - The error object from the failed request
   */
  onError?: (error: Error) => void;
}

/**
 * Custom hook for creating comments and replies
 * 
 * This mutation hook handles:
 * - Creating top-level comments
 * - Creating replies to comments
 * - Creating nested replies (reply to a reply)
 * 
 * After a successful creation:
 * - Automatically invalidates the comments cache for the post
 * - Triggers a refetch to show the new comment/reply
 * 
 * Error Handling:
 * - 401: Authentication required
 * - 409: Rate limit (commented too fast)
 * - 422: Validation errors (missing fields, forbidden words)
 * 
 * @param options - Configuration options for success/error callbacks
 * @returns Mutation object with mutate, isLoading, error, etc.
 * 
 * @example
 * ```typescript
 * const createCommentMutation = useMutationCreateComment({
 *   onSuccess: () => {
 *     toast.success("Comment posted successfully!");
 *   },
 *   onError: (error) => {
 *     toast.error("Failed to post comment. Please try again.");
 *   }
 * });
 * 
 * // Create a comment
 * createCommentMutation.mutate({
 *   post_id: "123",
 *   content: "Great post!",
 *   device: "iOS"
 * });
 * 
 * // Create a reply
 * createCommentMutation.mutate({
 *   post_id: "123",
 *   comment_id: "456",
 *   content: "I agree!"
 * });
 * ```
 */
export const useMutationCreateComment = (options?: UseCreateCommentOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    
    /**
     * On success, invalidate all comments for the post to trigger a refetch
     * This ensures the new comment/reply appears in the list immediately
     */
    onSuccess: async (data, variables) => {
      // Invalidate comments cache for this specific post
      await queryClient.invalidateQueries({
        queryKey: commentsKeys.byPost(variables.post_id),
      });
      
      // Call the custom success callback if provided
      options?.onSuccess?.();
    },
    
    /**
     * On error, call the custom error callback if provided
     * This allows the UI to show appropriate error messages
     */
    onError: (error: Error) => {
      console.error("Failed to create comment:", error);
      options?.onError?.(error);
    },
  });
};

