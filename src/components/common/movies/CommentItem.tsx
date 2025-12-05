/**
 * CommentItem Component
 * 
 * Renders a single comment with its replies.
 * Handles expanding/collapsing replies and like interactions.
 * 
 * Features:
 * - Display user info, content, and timestamp
 * - Like/unlike functionality with optimistic updates
 * - Expandable replies section
 * - Status badge for pending comments
 * - Reply button for creating nested replies
 * 
 * @module components/common/movies/CommentItem
 */

import { useState } from "react";
import type { Comment } from "@/types/comment";
import { LikeButton } from "./LikeButton";
import { ReplyItem } from "./ReplyItem";

/**
 * Props for the CommentItem component
 * Follows Interface Segregation Principle - only the needed props
 */
export interface CommentItemProps {
  /**
   * The comment data to display
   */
  comment: Comment;
  
  /**
   * Whether this comment is rendered as a child (nested)
   * @default false
   */
  isChild?: boolean;
  
  /**
   * The ID of the post containing this comment
   * Used for reply functionality and cache keys
   */
  postId: string;
  
  /**
   * Callback when the reply button is clicked
   * @param commentId - The ID of the comment being replied to
   */
  onReplyClick?: (commentId: string) => void;
  
  /**
   * Callback when the like button is clicked
   * @param commentId - The ID of the comment being liked/unliked
   * @param isLiked - Current liked state (true = currently liked, will unlike)
   */
  onLikeClick?: (commentId: string, isLiked: boolean) => void;
  
  /**
   * Whether the like button is disabled (e.g., during API call)
   * @default false
   */
  isLikeDisabled?: boolean;
}

/**
 * CommentItem Component
 * 
 * Displays a single comment with user information, content, like button,
 * and expandable replies section.
 * 
 * @example
 * ```tsx
 * <CommentItem
 *   comment={commentData}
 *   postId="post-123"
 *   onReplyClick={(commentId) => setReplyingTo(commentId)}
 *   onLikeClick={(commentId, isLiked) => toggleLike(commentId, isLiked)}
 *   isLikeDisabled={isLikePending}
 * />
 * ```
 */
export function CommentItem({
  comment,
  postId,
  onReplyClick,
  onLikeClick,
  isLikeDisabled = false,
}: CommentItemProps) {
  // State for controlling replies visibility
  const [showReplies, setShowReplies] = useState(false);

  /**
   * Toggle replies visibility
   * Only shows if there are replies available
   */
  const handleToggleReplies = () => {
    if (comment.replies.replies_count > 0) {
      setShowReplies(!showReplies);
    }
  };

  /**
   * Handle like button click
   * Delegates to parent component for state management
   */
  const handleLikeClick = () => {
    onLikeClick?.(comment.comment_id, comment.is_liked);
  };

  return (
    <div className="mx-4 mb-4 text-white">
      <div className="mb-2 flex items-start gap-2">
        {/* User Avatar */}
        <img
          src={comment.user.avatar || "https://via.placeholder.com/40"}
          alt={comment.user.nickname}
          width="40"
          height="40"
          className="rounded-full object-cover"
          loading="lazy"
        />

        <div className="flex-1">
          {/* Header: Username and Like Button */}
          <div className="flex items-center justify-between">
            {/* User Nickname */}
            <strong>{comment.user.nickname}</strong>

            {/* Like Button - Using reusable LikeButton component */}
            <LikeButton
              likeCount={comment.comment_like_count}
              isLiked={comment.is_liked}
              onClick={handleLikeClick}
              disabled={isLikeDisabled}
              size="md"
            />
          </div>

          {/* Comment Content */}
          <p className="text-sm font-thin">{comment.content}</p>

          {/* Timestamp and Status */}
          <div className="mt-1">
            <small className="text-xs text-gray-400">
              {new Date(comment.created_at).toLocaleString()}
            </small>

            {/* Status Badge - Only show if pending */}
            {comment.status === "pending" && (
              <span className="ml-2 text-xs text-yellow-400">
                (Pending approval)
              </span>
            )}
          </div>

          {/* Action Buttons: Reply and View Replies */}
          <div className="mt-1 flex items-center gap-4">
            {/* Reply Button */}
            <button
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              onClick={() => onReplyClick?.(comment.comment_id)}
              type="button"
            >
              Reply
            </button>

            {/* View/Hide Replies Button */}
            {comment.replies.replies_count > 0 && (
              <button
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                onClick={handleToggleReplies}
                type="button"
                aria-expanded={showReplies}
              >
                {showReplies ? "Hide" : "View"} {comment.replies.replies_count}{" "}
                {comment.replies.replies_count === 1 ? "Reply" : "Replies"}
                {comment.replies.hasMore && " (Load more available)"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies List - Collapsible Section */}
      {showReplies && comment.replies.list.length > 0 && (
        <div className="mt-2" role="list" aria-label="Replies">
          {comment.replies.list.map((reply) => (
            <ReplyItem 
              key={reply.reply_id} 
              reply={reply} 
              postId={postId} 
            />
          ))}
          
          {/* Load More Replies Indicator */}
          {comment.replies.hasMore && (
            <div className="ml-12 mt-2">
              <button
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                type="button"
                // TODO: Implement load more replies functionality
                onClick={() => {
                  // This would typically call an API to fetch more replies
                  console.log("Load more replies for comment:", comment.comment_id);
                }}
              >
                Load more replies...
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentItem;

