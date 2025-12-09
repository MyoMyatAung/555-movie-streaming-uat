/**
 * EmptyCommentState Component
 * 
 * Displays an attractive empty state when there are no comments.
 * Encourages users to be the first to comment.
 * 
 * Features:
 * - Clean, minimalist design
 * - Interactive "Comment" button
 * - Smooth scroll and focus behavior
 * - Accessible and user-friendly
 * 
 * @component
 * @example
 * ```tsx
 * <EmptyCommentState onCommentClick={handleCommentClick} />
 * ```
 */

import { MessageCircleMore } from "lucide-react";

/**
 * Props for the EmptyCommentState component
 */
interface EmptyCommentStateProps {
  /**
   * Callback function when the "Comment" button is clicked
   * Typically used to scroll to and focus the comment input field
   */
  onCommentClick: () => void;
}

/**
 * EmptyCommentState Component
 * 
 * Renders a centered empty state with:
 * - Icon: Message circle with dots (from lucide-react)
 * - Heading: "Start the comment"
 * - Button: "Comment" with hover/active states
 * 
 * @param props - Component props
 * @param props.onCommentClick - Handler for comment button click
 * @returns React component
 */
export function EmptyCommentState({ onCommentClick }: EmptyCommentStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-white">
      {/* Comment Icon - Using lucide-react MessageCircleMore icon */}
      <MessageCircleMore 
        size={40} 
        className="text-white/80"
        strokeWidth={1.5}
      />

      {/* Heading Text */}
      <h3 className="text-base font-medium text-white/90">
        Start the comment
      </h3>

      {/* Call-to-Action Button */}
      <button
        onClick={onCommentClick}
        className="rounded-sm bg-white/10 px-8 py-3 font-medium text-white transition-all hover:bg-white/20 active:scale-95"
        aria-label="Add a comment"
      >
        Comment
      </button>
    </div>
  );
}

