/**
 * LikeButton Component
 * 
 * A reusable button component for liking/unliking content (comments, replies, posts).
 * Follows the Single Responsibility Principle - only handles like button display and interaction.
 * 
 * Features:
 * - Visual feedback for liked state (filled heart when liked)
 * - Disabled state during API calls
 * - Accessible with proper aria labels
 * - Two size variants for different use cases
 * - Smooth transitions and hover effects
 * 
 * @module components/common/movies/LikeButton
 */

import HeartOutline from "@/assets/svgs/icon-heart-outline.svg?react";
import HeartActive from "@/assets/svgs/heart-active.svg?react";

/**
 * Props for the LikeButton component
 */
export interface LikeButtonProps {
  /**
   * Current like count to display
   */
  likeCount: number;
  
  /**
   * Whether the current user has liked this item
   */
  isLiked: boolean;
  
  /**
   * Callback when the like button is clicked
   */
  onClick: () => void;
  
  /**
   * Whether the button is disabled (e.g., during API call)
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Size variant for the button
   * - "sm": Smaller size for replies and nested content
   * - "md": Default size for comments
   * @default "md"
   */
  size?: "sm" | "md";
  
  /**
   * Optional className for additional styling
   */
  className?: string;
}

/**
 * LikeButton Component
 * 
 * A reusable, accessible button for liking/unliking content.
 * Uses CSS classes to show filled/unfilled heart state.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <LikeButton
 *   likeCount={42}
 *   isLiked={false}
 *   onClick={() => handleLike()}
 * />
 * 
 * // With disabled state and small size
 * <LikeButton
 *   likeCount={10}
 *   isLiked={true}
 *   onClick={() => handleLike()}
 *   disabled={isLoading}
 *   size="sm"
 * />
 * ```
 */
export function LikeButton({
  likeCount,
  isLiked,
  onClick,
  disabled = false,
  size = "md",
  className = "",
}: LikeButtonProps) {
  // Determine icon size based on variant
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const textClass = size === "sm" ? "text-xs" : "text-sm";

  // Build the heart icon classes based on liked state
  // When liked: fill with red color using both fill and text color
  // When not liked: outline only with gray color
  const heartClasses = isLiked
    ? `${iconClass} fill-red-500 text-red-500 transition-all duration-200`
    : `${iconClass} text-gray-400 transition-all duration-200 hover:text-red-400`;

  return (
    <button
      className={`flex items-center gap-1 transition-all duration-200 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={isLiked ? "Unlike this comment" : "Like this comment"}
      aria-pressed={isLiked}
      type="button"
    >
      {/* Like Count Display - Only show if there are likes */}
      <span className={`${textClass} text-gray-400`}>
        {likeCount > 0 ? likeCount : ""}
      </span>

      {/* 
       * Heart Icon
       * Uses CSS fill property to show filled/unfilled state
       * The HeartOutline SVG uses currentColor which allows us to control
       * both stroke and fill via CSS classes
       */}
      {isLiked ? <HeartActive className={heartClasses} /> : <HeartOutline className={heartClasses} />}
    </button>
  );
}

export default LikeButton;

