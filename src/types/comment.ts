/**
 * Comment Type Definitions
 * 
 * These types align with the API response structure from:
 * - GET /api/v1/post/comments (fetch comments)
 * - POST /api/v1/post/comment (create comment/reply)
 */

/**
 * User information embedded in comments
 */
export interface CommentUser {
  user_id: string;
  username: string;
  nickname: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  status: string;
  referral_code: string;
}

/**
 * Reply to a comment
 * Represents a nested response to a parent comment
 */
export interface CommentReply {
  reply_id: string;
  comment_id: string;
  parent_id: string | null;
  reply_to: string; // Nickname of the user being replied to
  status: "pending" | "success";
  content: string;
  user: CommentUser;
  created_at: string;
  reply_like_count: number;
  is_liked: boolean;
}

/**
 * Main comment structure
 * Represents a top-level comment on a post
 */
export interface Comment {
  comment_id: string;
  post_id: string;
  content: string;
  status: "pending" | "success";
  created_at: string;
  comment_like_count: number;
  is_liked: boolean;
  user: CommentUser;
  replies: {
    list: CommentReply[];
    replies_count: number;
    hasMore: boolean;
  };
}

/**
 * Response structure for fetching comments list
 */
export interface CommentsListResponse {
  status: boolean;
  message: string;
  data: {
    list: Comment[];
    comments_count: number;
    hasMore: boolean;
  };
}

/**
 * Request payload for creating a new comment or reply
 */
export interface CreateCommentRequest {
  post_id: string;
  content: string;
  comment_id?: string; // Required for replies
  reply_id?: string; // Required for nested replies (reply to a reply)
  device?: string; // Optional: "iOS", "Android", etc.
  app_version?: string; // Optional: "1.0.0"
}

/**
 * Response structure for creating a comment
 */
export interface CreateCommentResponse {
  status: boolean;
  message: string;
  data: {
    type: "comment" | "reply";
    data: Comment | CommentReply;
  };
}

/**
 * Query parameters for fetching comments
 */
export interface FetchCommentsParams {
  post_id: string;
  last_comment_id?: string; // For cursor-based pagination
  limit?: number; // 1-50, default: 20
}

/**
 * Request payload for liking/unliking a comment
 * Used by both like and unlike endpoints
 */
export interface CommentReactionRequest {
  comment_id: string;
}

/**
 * Response structure for comment like/unlike operations
 * 
 * Returned by:
 * - POST /api/v1/comment/like
 * - POST /api/v1/comment/unlike
 */
export interface CommentReactionResponse {
  status: boolean;
  message: string;
  data: {
    comment_id: string;
    liked: boolean;
    like_count: number;
  };
}

/**
 * Error response structure for comment reaction failures
 * Used for handling specific error cases like "already liked" or "not liked"
 */
export interface CommentReactionError {
  status: boolean;
  message: string;
  errors: null;
}

