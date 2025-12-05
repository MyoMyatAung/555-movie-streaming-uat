/**
 * Comment API Client
 * 
 * This module provides API client functions for comment-related operations.
 * It follows the Single Responsibility Principle by handling only API communication.
 * 
 * API Endpoints:
 * - GET /api/v1/post/comments - Fetch comments for a post
 * - POST /api/v1/post/comment - Create a comment or reply
 * - POST /api/v1/comment/like - Like a comment
 * - POST /api/v1/comment/unlike - Unlike a comment
 */

import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type {
  CommentsListResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  FetchCommentsParams,
  CommentReactionRequest,
  CommentReactionResponse,
} from "@/types/comment";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches comments for a specific post with pagination support
 * 
 * This function uses cursor-based pagination for efficient data loading.
 * Authentication is optional - if provided, user-specific fields like 'is_liked' will be populated.
 * 
 * @param params - Query parameters including post_id, pagination cursor, and limit
 * @returns Promise resolving to the comments list response
 * 
 * @example
 * ```typescript
 * // Fetch first page of comments
 * const firstPage = await fetchComments({ post_id: "123", limit: 20 });
 * 
 * // Fetch next page using cursor
 * const nextPage = await fetchComments({ 
 *   post_id: "123", 
 *   last_comment_id: lastCommentFromPreviousPage,
 *   limit: 20 
 * });
 * ```
 */
export const fetchComments = async (
  params: FetchCommentsParams,
): Promise<CommentsListResponse> => {
  const response = await AXIOS_CLIENT.get<CommentsListResponse>(
    `${API_BASE_URL}/post/comments`,
    { params },
  );
  return response.data;
};

/**
 * Creates a new comment or reply on a post
 * 
 * This function handles three scenarios:
 * 1. Creating a top-level comment (only post_id and content required)
 * 2. Creating a reply to a comment (post_id, comment_id, and content required)
 * 3. Creating a nested reply (post_id, comment_id, reply_id, and content required)
 * 
 * Requires authentication via Bearer token.
 * Created comments/replies initially have status "pending" awaiting moderation.
 * 
 * Rate limiting: 30-second timeout prevents spam submissions.
 * Content validation: Checked against forbidden words list.
 * 
 * @param data - The comment/reply data including content and optional reply references
 * @returns Promise resolving to the created comment/reply response
 * 
 * @example
 * ```typescript
 * // Create a top-level comment
 * const comment = await createComment({
 *   post_id: "123",
 *   content: "Great post!",
 *   device: "iOS",
 *   app_version: "1.0.0"
 * });
 * 
 * // Create a reply to a comment
 * const reply = await createComment({
 *   post_id: "123",
 *   comment_id: "456",
 *   content: "I agree!",
 * });
 * 
 * // Create a nested reply (reply to a reply)
 * const nestedReply = await createComment({
 *   post_id: "123",
 *   comment_id: "456",
 *   reply_id: "789",
 *   content: "Thanks for your input!"
 * });
 * ```
 */
export const createComment = async (
  data: CreateCommentRequest,
): Promise<CreateCommentResponse> => {
  const response = await AXIOS_CLIENT.post<CreateCommentResponse>(
    `${API_BASE_URL}/post/comment`,
    data,
  );
  return response.data;
};

/**
 * Likes a comment
 * 
 * Adds a like reaction to the specified comment.
 * Requires authentication via Bearer token.
 * 
 * Error Handling:
 * - 400: Already liked - User has already liked this comment
 * - 401: Unauthenticated - No valid token provided
 * - 404: Comment not found - Invalid comment_id
 * - 422: Validation error - Invalid comment_id format
 * 
 * @param data - Request payload containing the comment_id to like
 * @returns Promise resolving to the reaction response with updated like_count
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await likeComment({ comment_id: "660e8400-e29b-41d4-a716-446655440001" });
 *   console.log(`Liked! New count: ${response.data.like_count}`);
 * } catch (error) {
 *   if (error.response?.status === 400) {
 *     console.log("Already liked this comment");
 *   }
 * }
 * ```
 */
export const likeComment = async (
  data: CommentReactionRequest,
): Promise<CommentReactionResponse> => {
  const response = await AXIOS_CLIENT.post<CommentReactionResponse>(
    `${API_BASE_URL}/comment/like`,
    data,
  );
  return response.data;
};

/**
 * Unlikes a comment
 * 
 * Removes a like reaction from the specified comment.
 * Requires authentication via Bearer token.
 * Can only unlike a comment that was previously liked by the user.
 * 
 * Error Handling:
 * - 400: Not liked - User has not liked this comment
 * - 401: Unauthenticated - No valid token provided
 * - 404: Comment not found - Invalid comment_id
 * - 422: Validation error - Invalid comment_id format
 * 
 * @param data - Request payload containing the comment_id to unlike
 * @returns Promise resolving to the reaction response with updated like_count
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await unlikeComment({ comment_id: "660e8400-e29b-41d4-a716-446655440001" });
 *   console.log(`Unliked! New count: ${response.data.like_count}`);
 * } catch (error) {
 *   if (error.response?.status === 400) {
 *     console.log("Haven't liked this comment yet");
 *   }
 * }
 * ```
 */
export const unlikeComment = async (
  data: CommentReactionRequest,
): Promise<CommentReactionResponse> => {
  const response = await AXIOS_CLIENT.post<CommentReactionResponse>(
    `${API_BASE_URL}/comment/unlike`,
    data,
  );
  return response.data;
};

