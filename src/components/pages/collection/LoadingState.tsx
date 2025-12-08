/**
 * Collection Loading States
 *
 * Skeleton loading components for collection pages.
 * Provides visual feedback while data is being fetched.
 *
 * Components:
 * - LoadingState: Skeleton list for collection list page
 * - CollectionDetailLoading: Skeleton for collection detail page
 *
 * @example
 * ```tsx
 * // In collection list page
 * if (isLoading) return <LoadingState />;
 *
 * // In collection detail page
 * if (isLoading) return <CollectionDetailLoading />;
 * ```
 */

import { Skeleton } from "@/components/ui/skeleton";

// =============================================================================
// Collection List Skeleton
// =============================================================================

/**
 * CollectionCardSkeleton
 *
 * Skeleton placeholder for a single collection card.
 * Matches the layout of CollectionCard component.
 */
function CollectionCardSkeleton() {
  return (
    <div className="grid w-full grid-cols-12 items-center gap-x-3 rounded-xl border border-white/10 bg-white/1 p-3">
      {/* Thumbnail Skeleton */}
      <div className="col-span-4 aspect-3/2">
        <Skeleton className="h-full w-full rounded-md" />
      </div>

      {/* Content Skeleton */}
      <div className="col-span-8 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Metadata */}
        <div className="flex items-center gap-x-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * LoadingState
 *
 * Skeleton loading state for the collection list page.
 * Shows multiple skeleton cards to indicate loading.
 */
export function LoadingState() {
  return (
    <div className="flex flex-col gap-y-2 px-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <CollectionCardSkeleton key={index} />
      ))}
    </div>
  );
}

// =============================================================================
// Collection Detail Skeleton
// =============================================================================

/**
 * CollectionItemSkeleton
 *
 * Skeleton placeholder for a single collection item.
 * Matches the layout of CollectionItemCard component.
 */
function CollectionItemSkeleton() {
  return (
    <div className="grid w-full grid-cols-12 items-center gap-x-3">
      {/* Thumbnail Skeleton */}
      <div className="col-span-4 aspect-3/2">
        <Skeleton className="h-full w-full rounded-md" />
      </div>

      {/* Content Skeleton */}
      <div className="col-span-8 flex items-center justify-between">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <Skeleton className="h-5 w-4/5" />
          {/* Metadata */}
          <Skeleton className="h-4 w-2/3" />
          {/* Rating */}
          <Skeleton className="h-4 w-12" />
        </div>
        {/* Play Button */}
        <Skeleton className="size-10 rounded-full" />
      </div>
    </div>
  );
}

/**
 * CollectionDetailLoading
 *
 * Skeleton loading state for the collection detail page.
 * Shows skeleton items to indicate loading.
 */
export function CollectionDetailLoading() {
  return (
    <div className="flex flex-col gap-y-4 px-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <CollectionItemSkeleton key={index} />
      ))}
    </div>
  );
}

export default LoadingState;

