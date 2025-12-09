/**
 * CollectionItemCard Component
 *
 * Displays a single post/movie within a collection.
 * Shows thumbnail, title, metadata, and play button.
 *
 * Features:
 * - Thumbnail with resolution badge
 * - Title with episode/full info
 * - Rating display with star icon
 * - Play button for quick access
 * - Click handler for navigation
 *
 * @example
 * ```tsx
 * <CollectionItemCard
 *   item={post}
 *   onClick={() => navigate(`/player/${post.id}`)}
 * />
 * ```
 */

import CollectionCover from "@/assets/img/collection-cover.png";
import IconPlay from "@/assets/svgs/icon-play.svg?react";
import IconStar from "@/assets/svgs/icon-star-fill.svg?react";
import { Button } from "@/components/ui/button";
import type { CollectionItem, PostFile } from "@/types/collection";

// =============================================================================
// Types
// =============================================================================

export interface CollectionItemCardProps {
  /** Post/movie data from collection */
  item: CollectionItem;
  /** Click handler for card selection */
  onClick?: () => void;
  /** Click handler for play button */
  onPlayClick?: () => void;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get thumbnail URL from post files
 *
 * @param files - Array of post files
 * @returns Thumbnail URL or undefined
 */
function getThumbnail(files?: PostFile[]): string | undefined {
  if (!files || files.length === 0) return undefined;
  return files[0]?.thumbnail;
}

/**
 * Get resolution from post files
 *
 * @param files - Array of post files
 * @returns Resolution string (e.g., "4K", "HD") or undefined
 */
function getResolution(files?: PostFile[]): string | undefined {
  if (!files || files.length === 0) return undefined;
  const file = files[0];
  if (!file) return undefined;

  // Determine resolution based on width
  if (file.width >= 3840) return "4K";
  if (file.width >= 1920) return "HD";
  if (file.width >= 1280) return "HD";
  return undefined;
}

/**
 * Get video duration in minutes
 *
 * @param files - Array of post files
 * @returns Duration in minutes or 0
 */
function getDuration(files?: PostFile[]): number {
  if (!files || files.length === 0) return 0;
  const duration = files[0]?.duration;
  return duration ? Math.floor(duration / 60) : 0;
}

// =============================================================================
// Component
// =============================================================================

/**
 * CollectionItemCard
 *
 * Renders a post/movie card within a collection.
 * Displays thumbnail, title, duration, and play action.
 */
export function CollectionItemCard({
  item,
  onClick,
  onPlayClick,
}: CollectionItemCardProps) {
  const thumbnail = getThumbnail(item.files);
  const resolution = getResolution(item.files);
  const duration = getDuration(item.files);

  // Handle play button click without triggering card click
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayClick?.();
  };

  return (
    <div
      className="grid w-full cursor-pointer grid-cols-12 items-center gap-x-3"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Thumbnail Container */}
      <div className="relative col-span-4 aspect-3/2 overflow-hidden rounded-md">
        <img
          src={thumbnail ?? CollectionCover}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {/* Resolution Badge */}
        {resolution && (
          <div className="absolute top-0 right-0 rounded-bl-md bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white">
            {resolution}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="col-span-8 flex items-center justify-between text-white">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <p className="line-clamp-1 text-lg font-medium">{item.title}</p>

          {/* Metadata Row */}
          <div className="flex items-center text-sm text-white/70">
            {/* Duration */}
            {duration > 0 && (
              <>
                <span>{duration} min</span>
                <div className="mx-2 h-4 border-l border-white/20" />
              </>
            )}

            {/* Tags */}
            {item.tag && item.tag.length > 0 && (
              <span className="line-clamp-1">{item.tag.slice(0, 2).join(", ")}</span>
            )}
          </div>

          {/* Rating placeholder - API doesn't provide rating yet */}
          <div className="flex items-center gap-x-2">
            <IconStar className="size-4 text-neutral-50" />
            <span className="text-sm text-white/70">—</span>
          </div>
        </div>

        {/* Play Button */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handlePlayClick}
          className="ml-3 rounded-full border border-white/10 backdrop-blur-xs hover:bg-white/10"
        >
          <IconPlay className="size-6 text-white" />
        </Button>
      </div>
    </div>
  );
}

export default CollectionItemCard;
