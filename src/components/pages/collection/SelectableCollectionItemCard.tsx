/**
 * SelectableCollectionItemCard Component
 *
 * A variant of CollectionItemCard that supports selection state.
 * Used in the "Remove items from collection" mode.
 *
 * Features:
 * - Checkbox/radio style selection indicator
 * - Visual feedback for selected state (blue checkmark)
 * - Unselected state (empty circle)
 * - Prevents navigation when in selection mode
 *
 * @example
 * ```tsx
 * <SelectableCollectionItemCard
 *   item={post}
 *   isSelected={selectedIds.has(post.id)}
 *   onToggle={() => handleToggleSelection(post.id)}
 * />
 * ```
 */

import { CheckIcon } from "lucide-react";
import CollectionCover from "@/assets/img/collection-cover.png";
import IconStar from "@/assets/svgs/icon-star-fill.svg?react";
import { cn } from "@/lib/utils";
import type { CollectionItem, PostFile } from "@/types/collection";

// =============================================================================
// Types
// =============================================================================

export interface SelectableCollectionItemCardProps {
  /** Post/movie data from collection */
  item: CollectionItem;
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Toggle selection handler */
  onToggle: () => void;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get thumbnail URL from post files
 */
function getThumbnail(files?: PostFile[]): string | undefined {
  if (!files || files.length === 0) return undefined;
  return files[0]?.thumbnail;
}

/**
 * Get resolution from post files (4K, HD, etc.)
 */
function getResolution(files?: PostFile[]): string | undefined {
  if (!files || files.length === 0) return undefined;
  const file = files[0];
  if (!file) return undefined;

  if (file.width >= 3840) return "4K";
  if (file.width >= 1920) return "HD";
  if (file.width >= 1280) return "HD";
  return undefined;
}

/**
 * Get video duration in minutes
 */
function getDuration(files?: PostFile[]): number {
  if (!files || files.length === 0) return 0;
  const duration = files[0]?.duration;
  return duration ? Math.floor(duration / 60) : 0;
}

// =============================================================================
// Sub-components
// =============================================================================

/**
 * SelectionIndicator
 *
 * Visual indicator for selection state.
 * Shows empty circle when unselected, blue checkmark when selected.
 */
function SelectionIndicator({ isSelected }: { isSelected: boolean }) {
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
        isSelected
          ? "border-blue-500 bg-blue-500"
          : "border-white/30 bg-transparent"
      )}
    >
      {isSelected && <CheckIcon className="size-4 text-white" strokeWidth={3} />}
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

/**
 * SelectableCollectionItemCard
 *
 * Renders a selectable post card for batch removal operations.
 * Click anywhere on the card to toggle selection.
 */
export function SelectableCollectionItemCard({
  item,
  isSelected,
  onToggle,
}: SelectableCollectionItemCardProps) {
  const thumbnail = getThumbnail(item.files);
  const resolution = getResolution(item.files);
  const duration = getDuration(item.files);

  return (
    <div
      className={cn(
        "grid w-full cursor-pointer grid-cols-12 items-center gap-x-3 rounded-lg p-1 transition-colors",
        isSelected && "bg-white/5"
      )}
      onClick={onToggle}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
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
            {duration > 0 && (
              <>
                <span>{duration} min</span>
                <div className="mx-2 h-4 border-l border-white/20" />
              </>
            )}
            {item.tag && item.tag.length > 0 && (
              <span className="line-clamp-1">{item.tag.slice(0, 2).join(", ")}</span>
            )}
          </div>

          {/* Rating placeholder */}
          <div className="flex items-center gap-x-2">
            <IconStar className="size-4 text-neutral-50" />
            <span className="text-sm text-white/70">—</span>
          </div>
        </div>

        {/* Selection Indicator (replaces play button) */}
        <div className="ml-3">
          <SelectionIndicator isSelected={isSelected} />
        </div>
      </div>
    </div>
  );
}

export default SelectableCollectionItemCard;

