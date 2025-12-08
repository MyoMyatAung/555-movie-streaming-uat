/**
 * CollectionListItem Component
 *
 * Displays a single collection row in the "Add to Collection" list.
 * Shows collection thumbnail, name, video count, visibility status,
 * and an add/remove button.
 *
 * Features:
 * - Collection thumbnail with fallback
 * - Name and video count display
 * - Private/public indicator
 * - Add/remove toggle with loading state
 * - Accessibility support
 *
 * @example
 * ```tsx
 * <CollectionListItem
 *   collection={collection}
 *   isInCollection={true}
 *   isLoading={false}
 *   onToggle={() => handleToggle(collection.id)}
 * />
 * ```
 */

import { LockIcon, PlusIcon, CheckIcon, Loader2Icon } from "lucide-react";
import type { Collection } from "@/types/collection";

// =============================================================================
// Types
// =============================================================================

export interface CollectionListItemProps {
  /** Collection data to display */
  collection: Collection;
  /** Whether the post is already in this collection */
  isInCollection: boolean;
  /** Whether an operation is in progress */
  isLoading?: boolean;
  /** Handler for add/remove toggle */
  onToggle: () => void;
}

// =============================================================================
// Component
// =============================================================================

/**
 * CollectionListItem
 *
 * Renders a collection row with thumbnail, info, and action button.
 * The action button toggles between add (+) and check (✓) icons.
 */
export function CollectionListItem({
  collection,
  isInCollection,
  isLoading = false,
  onToggle,
}: CollectionListItemProps) {
  // Determine button icon and accessibility label
  const getButtonContent = () => {
    if (isLoading) {
      return <Loader2Icon className="size-5 animate-spin text-white/70" />;
    }
    if (isInCollection) {
      return <CheckIcon className="size-5 text-[#4A90E2]" />;
    }
    return <PlusIcon className="size-5 text-white/70" />;
  };

  const buttonLabel = isInCollection
    ? `Remove from ${collection.name}`
    : `Add to ${collection.name}`;

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Collection Thumbnail */}
      <div className="size-12 shrink-0 overflow-hidden rounded-md bg-[#2A2A2A]">
        {collection.thumbnail_url ? (
          <img
            src={collection.thumbnail_url}
            alt={collection.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3A3A3A] to-[#2A2A2A]">
            <span className="text-lg font-bold text-white/30">
              {collection.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Collection Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-white">{collection.name}</p>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <span>{collection.posts_count} Videos</span>
          {!collection.is_public && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <LockIcon className="size-3" />
                Private
              </span>
            </>
          )}
        </div>
      </div>

      {/* Add/Remove Button */}
      <button
        type="button"
        onClick={onToggle}
        disabled={isLoading}
        aria-label={buttonLabel}
        className="flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-50"
      >
        {getButtonContent()}
      </button>
    </div>
  );
}

export default CollectionListItem;

