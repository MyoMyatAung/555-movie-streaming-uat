/**
 * Comment API Module
 * 
 * Central export point for all comment-related API functions, hooks, and types.
 * This follows the Facade Pattern to provide a clean interface to the comment API.
 * 
 * Exports:
 * - commentApi: Low-level API client functions (fetch, create, like, unlike)
 * - queryGetComments: Basic query hook for fetching comments
 * - useInfiniteComments: Infinite scroll hook for paginated comments
 * - useMutationCreateComment: Mutation hook for creating comments/replies
 * - useMutationLikeComment: Mutation hook for liking comments
 * - useMutationUnlikeComment: Mutation hook for unliking comments
 * - useToggleCommentLike: Convenience hook for toggling like state
 */

export * from "./commentApi";
export * from "./queryGetComments";
export * from "./mutationCreateComment";
export * from "./mutationCommentReaction";
export * from "./useInfiniteComments";

