/**
 * ReplyItem Component
 * 
 * Renders a single reply to a comment.
 * Separated for better maintainability and reusability.
 * 
 * Features:
 * - Display user avatar and nickname
 * - Show reply target (who the reply is to)
 * - Display reply content and timestamp
 * - Show like count and state
 * - Status badge for pending replies
 * 
 * Note: Reply like functionality uses the same API as comment likes.
 * However, the current API only supports comment-level likes.
 * Reply likes are displayed but not interactive until API support is added.
 * 
 * @module components/common/movies/ReplyItem
 */

import HeartOutline from "@/assets/svgs/icon-heart-outline.svg?react";
import type { CommentReply } from "@/types/comment";

/**
 * Props for the ReplyItem component
 */
export interface ReplyItemProps {
  /**
   * The reply data to display
   */
  reply: CommentReply;
  
  /**
   * The ID of the post containing this reply
   * Used for potential future functionality like deep linking
   */
  postId: string;
  
  /**
   * Optional callback when the like button is clicked
   * Currently not implemented as API doesn't support reply-level likes
   */
  onLikeClick?: (replyId: string, isLiked: boolean) => void;
  
  /**
   * Whether like functionality is disabled
   * @default true (reply likes not yet supported by API)
   */
  isLikeDisabled?: boolean;
}

/**
 * ReplyItem Component
 * 
 * Displays a single reply with user information, content, and metadata.
 * Designed to be nested under CommentItem components.
 * 
 * @example
 * ```tsx
 * <ReplyItem
 *   reply={replyData}
 *   postId="post-123"
 * />
 * ```
 */
export function ReplyItem({
  reply,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLikeClick,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLikeDisabled = true,
}: ReplyItemProps) {
  return (
    <div className="ml-12 mb-2 flex items-start gap-2 text-white">
      {/* User Avatar */}
      <img
        src={reply.user.avatar || "https://via.placeholder.com/40"}
        alt={reply.user.nickname}
        width="32"
        height="32"
        className="rounded-full object-cover"
        loading="lazy"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <strong className="text-sm">{reply.user.nickname}</strong>
            
            {/* Reply Target - Shows who this reply is directed to */}
            {reply.reply_to && reply.reply_to !== "Unknown" && (
              <span className="text-xs text-gray-400">
                → {reply.reply_to}
              </span>
            )}
          </div>

          {/* 
           * Like Button for Replies
           * Currently display-only since the API only supports comment-level likes.
           * When API support for reply likes is added, this can be made interactive
           * by uncommenting the onClick handler and using the LikeButton component.
           */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">
              {reply.reply_like_count > 0 ? reply.reply_like_count : ""}
            </span>
            <HeartOutline
              className={`h-4 w-4 ${
                reply.is_liked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Reply Content */}
        <p className="text-sm font-thin">{reply.content}</p>

        {/* Timestamp and Status */}
        <div className="mt-1 flex items-center">
          <small className="text-xs text-gray-400">
            {new Date(reply.created_at).toLocaleString()}
          </small>

          {/* Status Badge - Only show if pending */}
          {reply.status === "pending" && (
            <span className="ml-2 text-xs text-yellow-400">
              (Pending approval)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReplyItem;

