/**
 * CollectionCard Component
 *
 * Displays a single collection in a list format.
 * Shows collection thumbnail, name, video count, and visibility status.
 *
 * Features:
 * - Special styling for "Favorite" (default) collection
 * - Public/Private visibility indicator
 * - Fallback image for collections without thumbnails
 * - Click handler for navigation
 *
 * @example
 * ```tsx
 * <CollectionCard
 *   collection={collection}
 *   isDefault={collection.id === "favorite"}
 *   onClick={() => navigate(`/profile/collection/${collection.id}`)}
 * />
 * ```
 */

import CollectionCover from "@/assets/img/collection-cover.png";
import IconHeart from "@/assets/svgs/icon-heart.svg?react";
import type { Collection } from "@/types/collection";
import { GlobeIcon, LockIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

// =============================================================================
// Types
// =============================================================================

export interface CollectionCardProps {
  /** Collection data from API */
  collection: Collection;
  /** Whether this is the default "Favorite" collection */
  isDefault?: boolean;
  /** Click handler for card selection */
  onClick?: () => void;
}

// =============================================================================
// Component
// =============================================================================

/**
 * CollectionCard
 *
 * Renders a collection card with thumbnail, title, video count, and visibility.
 * The default "Favorite" collection has special heart icon styling.
 */
export function CollectionCard({
  collection,
  isDefault = false,
  onClick,
}: CollectionCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className="grid w-full cursor-pointer grid-cols-12 items-center gap-x-3 rounded-xl border border-white/10 bg-white/1 p-3 transition-colors hover:bg-white/5"
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
        {!isDefault ? (
          <img
            src={collection.thumbnail_url ?? CollectionCover}
            alt={collection.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-[#EA177D52]" />
        )}

        {/* Heart icon overlay for default collection */}
        {isDefault && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-[4px]">
              <IconHeart className="size-6 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="col-span-8 flex justify-between text-white">
        <div className="space-y-2">
          {/* Collection Name */}
          <p className="line-clamp-1 text-lg font-medium">{collection.name}</p>

          {/* Video Count & Visibility */}
          <div className="flex items-center">
            <p className="text-sm">
              {collection.posts_count} {t("profile.collection.videos")}
            </p>
            <div className="mx-2 h-5 border border-l border-white/12" />
            <div className="flex items-center gap-x-1 text-[#888888]">
              {collection.is_public ? (
                <GlobeIcon className="size-4" />
              ) : (
                <LockIcon className="size-4" />
              )}
              <p className="text-sm">
                {collection.is_public
                  ? t("profile.collection.public")
                  : t("profile.collection.private")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectionCard;
