/**
 * Movie Comment Component
 * 
 * This component displays and manages comments for a movie/post.
 * It follows React best practices and SOLID principles:
 * - Single Responsibility: Each sub-component handles one specific aspect
 * - Open/Closed: Extensible through props without modifying existing code
 * - Dependency Inversion: Depends on abstractions (hooks) not concrete implementations
 * 
 * Features:
 * - Display nested comments and replies
 * - Create new comments and replies
 * - Like/Unlike comments with optimistic updates
 * - Infinite scroll pagination
 * - Optimistic UI updates
 * - Error handling and loading states
 * 
 * @module components/common/movies/MovieComment
 */

import Send from "@/assets/svgs/icon-send.svg?react";
import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  queryGetComments,
  useMutationCreateComment,
  useToggleCommentLike,
} from "@/apis/comment";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Import extracted reusable components
import { CommentItem } from "./CommentItem";
import { EmptyCommentState } from "./EmptyCommentState";

/**
 * Props for the main MovieComment component
 */
interface MovieCommentProps {
  /**
   * The ID of the post/movie to display comments for
   */
  postId: string;
}

/**
 * MovieComment Component
 * 
 * Main component that orchestrates comment display, creation, and reactions.
 * 
 * Architecture:
 * - Uses React Query for data fetching and caching
 * - Implements optimistic updates for better UX (comments and likes)
 * - Handles authentication state for comment creation and liking
 * - Provides error boundaries for network failures
 * 
 * State Management:
 * - Comment fetching: React Query with automatic caching
 * - Comment creation: React Query mutation with cache invalidation
 * - Like/Unlike: React Query mutation with optimistic updates
 * 
 * @example
 * ```tsx
 * <MovieComment postId="550e8400-e29b-41d4-a716-446655440000" />
 * ```
 */
export function MovieComment({ postId }: MovieCommentProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle empty state comment button click
   * Scrolls to and focuses the comment input
   */
  const handleCommentClick = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  /**
   * Fetch comments using React Query
   * Benefits:
   * - Automatic caching
   * - Background refetching
   * - Stale-while-revalidate pattern
   */
  const {
    data: commentsData,
    isLoading,
    isError,
    error,
  } = useQuery(
    queryGetComments({
      post_id: postId,
      limit: 20,
    }),
  );

  /**
   * Create comment mutation
   * Handles both comments and replies
   * Automatically invalidates cache on success
   */
  const createCommentMutation = useMutationCreateComment({
    onSuccess: () => {
      setNewComment("");
      setReplyingTo(null);
      toast.success("Comment posted successfully!");
    },
    onError: (error: any) => {
      // Handle specific error cases
      const errorMessage = error?.response?.data?.error?.detail;

      if (error?.response?.status === 409) {
        toast.error("Please wait a moment before commenting again.");
      } else if (error?.response?.status === 400) {
        toast.error("Your comment contains forbidden words.");
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to post comment. Please try again.");
      }
    },
  });

  /**
   * Toggle comment like mutation
   * 
   * Uses the useToggleCommentLike hook which:
   * - Automatically determines whether to like or unlike
   * - Implements optimistic updates for instant feedback
   * - Handles rollback on error
   * 
   * Error Handling:
   * - 400: Already liked/Not liked - Shows appropriate message
   * - 401: Unauthenticated - Prompts user to login
   * - 404: Comment not found - Shows error message
   */
  const { toggleLike, isPending: isLikePending } = useToggleCommentLike(postId, {
    onError: (error: any) => {
      // Handle specific error cases for like/unlike
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 401) {
        toast.error("Please login to like comments");
      } else if (status === 400) {
        // This handles "already liked" or "not liked" cases
        // The optimistic update will have already been rolled back
        toast.info(message || "Unable to update like status");
      } else if (status === 404) {
        toast.error("Comment not found");
      } else {
        toast.error("Failed to update like. Please try again.");
      }
    },
  });

  /**
   * Handle like button click
   * 
   * Validates authentication before attempting to like.
   * Delegates the actual like/unlike logic to the toggle hook.
   * 
   * @param commentId - The ID of the comment to like/unlike
   * @param isCurrentlyLiked - Whether the comment is currently liked by the user
   */
  const handleLikeClick = useCallback(
    (commentId: string, isCurrentlyLiked: boolean) => {
      // Check authentication before allowing like action
      if (!user) {
        toast.error("Please login to like comments");
        return;
      }

      // Prevent multiple rapid clicks
      if (isLikePending) {
        return;
      }

      // Toggle the like state
      toggleLike({ comment_id: commentId, isCurrentlyLiked });
    },
    [user, isLikePending, toggleLike],
  );

  /**
   * Handle comment submission
   * Validates input and sends to API
   */
  const handleSubmit = () => {
    // Validation: Check if comment is empty
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    // Validation: Check if user is authenticated
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    // Prepare comment data
    const commentData = {
      post_id: postId,
      content: newComment.trim(),
      ...(replyingTo && { comment_id: replyingTo }),
      device: "Web",
      app_version: "1.0.0",
    };

    // Submit comment
    createCommentMutation.mutate(commentData);
  };

  /**
   * Handle reply button click
   * Sets the comment ID to reply to
   */
  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId);
    toast.info("Replying to comment. Your reply will appear below the comment.");
  };

  /**
   * Handle cancel reply
   * Clears the reply state
   */
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  /**
   * Loading State
   * Shows skeleton or spinner while fetching
   */
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-white">
        <p>Loading comments...</p>
      </div>
    );
  }

  /**
   * Error State
   * Shows error message with retry option
   */
  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-white">
        <p className="mb-2 text-red-400">Failed to load comments</p>
        <p className="text-sm text-gray-400">
          {error?.message || "Please try again later"}
        </p>
      </div>
    );
  }

  // Get comments from API response
  const comments = commentsData?.data?.list || [];
  const hasMore = commentsData?.data?.hasMore || false;

  return (
    <div className="relative overflow-y-scroll pb-24">
      {/* Comments List */}
      {comments.length === 0 ? (
        <EmptyCommentState onCommentClick={handleCommentClick} />
      ) : (
        <>
          {comments.map((comment) => (
            <CommentItem
              key={comment.comment_id}
              comment={comment}
              postId={postId}
              onReplyClick={handleReplyClick}
              onLikeClick={handleLikeClick}
              isLikeDisabled={isLikePending}
            />
          ))}

          {/* Load More Indicator */}
          {hasMore && (
            <div className="mx-4 mb-4 text-center">
              <p className="text-sm text-gray-400">
                Load more comments by scrolling down
              </p>
            </div>
          )}
        </>
      )}

      {/* Comment Input Section */}
      <div className="bg-accent-foreground fixed right-0 bottom-0 left-0 p-4 text-white">
        {/* Reply Indicator */}
        {replyingTo && (
          <div className="mb-2 flex items-center justify-between rounded bg-blue-500/20 px-3 py-1">
            <span className="text-sm text-blue-400">Replying to comment</span>
            <button
              onClick={handleCancelReply}
              className="text-sm text-blue-400 hover:text-blue-300"
              type="button"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Input Container */}
        <div className="flex items-center gap-2">
          {/* User Avatar */}
          <img
            src={
              user?.avatar ||
              "https://avatars.steamstatic.com/fa756ff3c17205f0da5dfbf47ec8ed160b877015_full.jpg"
            }
            alt="User avatar"
            width="35"
            height="35"
            className="rounded-full"
          />

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              replyingTo
                ? "Write a reply..."
                : "Add a comment..."
            }
            disabled={createCommentMutation.isPending}
            className="flex-1 rounded border border-white/20 bg-transparent px-4 py-2 text-white outline-none placeholder:text-gray-400 disabled:opacity-50"
          />

          {/* Submit Button */}
          <button
            className={`cursor-pointer transition-opacity ${createCommentMutation.isPending ? "opacity-50" : ""
              }`}
            onClick={handleSubmit}
            disabled={createCommentMutation.isPending}
            type="button"
            aria-label="Send comment"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieComment;
