/**
 * AddToFavoriteSheet Component
 *
 * Bottom sheet modal for adding a post to favorites or collections.
 * This is the main entry point when users click the bookmark button.
 *
 * Features:
 * - Save to favorite (one-click toggle)
 * - Add to existing collections
 * - Create new collection and add post
 * - Real-time status updates
 * - Loading and error states
 *
 * Architecture:
 * - Uses compound component pattern for flexibility
 * - Separates favourite logic from collection logic
 * - Implements optimistic UI updates where possible
 * - Follows SOLID principles with single responsibility components
 *
 * @example
 * ```tsx
 * <AddToFavoriteSheet
 *   isOpen={showSheet}
 *   onClose={() => setShowSheet(false)}
 *   postId={currentPostId}
 * />
 * ```
 */

import SheetModal from "@/components/common/SheetModal";
import {
  ChevronRightIcon,
  FolderPlusIcon,
  HeartIcon,
  Loader2Icon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { CollectionListItem } from "./CollectionListItem";
import { CreateCollectionSheet } from "./CreateCollectionSheet";

// API Hooks
import {
  useAddPostToCollection,
  useCollectionList,
  useRemovePostFromCollection,
} from "@/apis/collection";
import {
  useAddFavourite,
  useCheckFavourite,
  useRemoveFavourite,
} from "@/apis/favourite";

import type { Collection } from "@/types/collection";

// =============================================================================
// Types
// =============================================================================

export interface AddToFavoriteSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Post ID to add to favourite/collection */
  postId: string;
}

// =============================================================================
// Sub-components
// =============================================================================

/**
 * FavoriteSection
 *
 * The "Saved to favorite" row at the top of the sheet.
 * Allows quick one-click favourite toggle.
 */
interface FavoriteSectionProps {
  isFavourited: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

function FavoriteSection({
  isFavourited,
  isLoading,
  onToggle,
}: FavoriteSectionProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      className="flex w-full items-center gap-3 rounded-xl bg-[#1E1E1E] p-4 transition-colors hover:bg-[#2A2A2A] disabled:opacity-50"
    >
      {/* Heart Icon */}
      <div
        className={`flex size-10 items-center justify-center rounded-full ${
          isFavourited ? "bg-[#4A90E2]" : "bg-[#3A3A3A]"
        }`}
      >
        {isLoading ? (
          <Loader2Icon className="size-5 animate-spin text-white" />
        ) : (
          <HeartIcon
            className={`size-5 ${
              isFavourited ? "fill-white text-white" : "text-white/70"
            }`}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 text-left">
        <p className="font-medium text-white">
          {isFavourited ? "Saved to favorite" : "Save to favorite"}
        </p>
        <p className="text-sm text-white/50">
          You can see your file in favorite list
        </p>
      </div>

      {/* Arrow */}
      <ChevronRightIcon className="size-5 text-white/50" />
    </button>
  );
}

/**
 * CollectionHeader
 *
 * Header for the collection list section with "Create" button.
 */
interface CollectionHeaderProps {
  onCreateClick: () => void;
}

function CollectionHeader({ onCreateClick }: CollectionHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <h3 className="text-sm font-medium text-white/70">Add To a collection</h3>
      <button
        type="button"
        onClick={onCreateClick}
        className="text-sm font-medium text-[#4A90E2] transition-colors hover:text-[#4A90E2]/80"
      >
        Create
      </button>
    </div>
  );
}

/**
 * CollectionListSkeleton
 *
 * Loading skeleton for the collection list.
 */
function CollectionListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <div className="size-12 animate-pulse rounded-md bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
          </div>
          <div className="size-10 animate-pulse rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

/**
 * EmptyCollectionState
 *
 * Shows when user has no collections.
 */
interface EmptyCollectionStateProps {
  onCreateClick: () => void;
}

function EmptyCollectionState({ onCreateClick }: EmptyCollectionStateProps) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <FolderPlusIcon className="mb-3 size-12 text-white/30" />
      <p className="mb-4 text-white/50">No collections yet</p>
      <button
        type="button"
        onClick={onCreateClick}
        className="rounded-lg bg-[#4A90E2] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4A90E2]/90"
      >
        Create Collection
      </button>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * AddToFavoriteSheet
 *
 * Main component that orchestrates the add to favorite/collection flow.
 * Manages state for favourite status, collection memberships, and
 * coordinates between sub-components.
 */
export function AddToFavoriteSheet({
  isOpen,
  onClose,
  postId,
}: AddToFavoriteSheetProps) {
  // Local state for create collection modal
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  // Track which collections the post is in (for optimistic updates)
  const [collectionMemberships, setCollectionMemberships] = useState<
    Set<string>
  >(new Set());

  // ---------------------------------------------------------------------------
  // API Hooks - Favourites
  // ---------------------------------------------------------------------------
  const { data: favouriteData, isLoading: isCheckingFavourite } =
    useCheckFavourite(postId, { enabled: isOpen });

  const { mutate: addFavourite, isPending: isAddingFavourite } =
    useAddFavourite();
  const { mutate: removeFavourite, isPending: isRemovingFavourite } =
    useRemoveFavourite();

  const isFavourited = favouriteData?.data?.is_favourite ?? false;
  const isFavouriteLoading =
    isCheckingFavourite || isAddingFavourite || isRemovingFavourite;

  // ---------------------------------------------------------------------------
  // API Hooks - Collections
  // ---------------------------------------------------------------------------
  const { data: collectionsData, isLoading: isLoadingCollections } =
    useCollectionList({ page: 1, per_page: 100 }, { enabled: isOpen });

  const { mutate: addToCollection, isPending: isAddingToCollection } =
    useAddPostToCollection();
  const { mutate: removeFromCollection, isPending: isRemovingFromCollection } =
    useRemovePostFromCollection();

  // Filter out the virtual "favorite" collection from the list
  const collections = useMemo(() => {
    return (
      collectionsData?.data?.collections?.filter((c) => c.id !== "favorite") ??
      []
    );
  }, [collectionsData]);

  // Track pending operations per collection
  const [pendingCollections, setPendingCollections] = useState<Set<string>>(
    new Set(),
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * Toggle favourite status
   */
  const handleToggleFavourite = useCallback(() => {
    if (isFavourited) {
      removeFavourite(
        { post_id: postId },
        {
          onSuccess: () => {
            toast.success("Removed from favorites");
          },
          onError: (error) => {
            toast.error(error.message || "Failed to remove from favorites");
          },
        },
      );
    } else {
      addFavourite(
        { post_id: postId },
        {
          onSuccess: () => {
            toast.success("Added to favorites");
          },
          onError: (error) => {
            toast.error(error.message || "Failed to add to favorites");
          },
        },
      );
    }
  }, [isFavourited, postId, addFavourite, removeFavourite]);

  /**
   * Toggle collection membership
   */
  const handleToggleCollection = useCallback(
    (collection: Collection, isInCollection: boolean) => {
      // Mark as pending
      setPendingCollections((prev) => new Set(prev).add(collection.id));

      if (isInCollection) {
        removeFromCollection(
          { collection_id: collection.id, post_id: postId },
          {
            onSuccess: () => {
              setCollectionMemberships((prev) => {
                const next = new Set(prev);
                next.delete(collection.id);
                return next;
              });
              toast.success(`Removed from "${collection.name}"`);
            },
            onError: (error) => {
              toast.error(error.message || "Failed to remove from collection");
            },
            onSettled: () => {
              setPendingCollections((prev) => {
                const next = new Set(prev);
                next.delete(collection.id);
                return next;
              });
            },
          },
        );
      } else {
        addToCollection(
          { collection_id: collection.id, post_id: postId },
          {
            onSuccess: () => {
              setCollectionMemberships((prev) =>
                new Set(prev).add(collection.id),
              );
              toast.success(`Added to "${collection.name}"`);
            },
            onError: (error) => {
              // Handle "already in collection" gracefully
              if (error.message?.includes("already in collection")) {
                setCollectionMemberships((prev) =>
                  new Set(prev).add(collection.id),
                );
                toast.info(`Already in "${collection.name}"`);
              } else {
                toast.error(error.message || "Failed to add to collection");
              }
            },
            onSettled: () => {
              setPendingCollections((prev) => {
                const next = new Set(prev);
                next.delete(collection.id);
                return next;
              });
            },
          },
        );
      }
    },
    [postId, addToCollection, removeFromCollection],
  );

  /**
   * Handle create collection success
   * Automatically adds the post to the newly created collection
   */
  const handleCreateSuccess = useCallback(
    (newCollection: Collection) => {
      setShowCreateSheet(false);

      // Automatically add post to the new collection
      addToCollection(
        { collection_id: newCollection.id, post_id: postId },
        {
          onSuccess: () => {
            setCollectionMemberships((prev) =>
              new Set(prev).add(newCollection.id),
            );
            toast.success(`Added to "${newCollection.name}"`);
          },
          onError: () => {
            // Collection was created, just failed to add post
            toast.info(
              `Collection created. Tap + to add this video to "${newCollection.name}"`,
            );
          },
        },
      );
    },
    [postId, addToCollection],
  );

  /**
   * Handle sheet close
   */
  const handleClose = useCallback(() => {
    if (!isAddingToCollection && !isRemovingFromCollection) {
      setShowCreateSheet(false);
      setCollectionMemberships(new Set());
      setPendingCollections(new Set());
      onClose();
    }
  }, [isAddingToCollection, isRemovingFromCollection, onClose]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <SheetModal
        showModal={isOpen}
        setShowModal={(show) => !show && handleClose()}
        title="Add To Favorite"
        onClose={handleClose}
        containerClassName="!bg-dark-gray"
      >
        <div className="px-4 pb-8">
          {/* Favorite Section */}
          <FavoriteSection
            isFavourited={isFavourited}
            isLoading={isFavouriteLoading}
            onToggle={handleToggleFavourite}
          />

          {/* Collection Section Header */}
          <CollectionHeader onCreateClick={() => setShowCreateSheet(true)} />

          {/* Collection List */}
          {isLoadingCollections ? (
            <CollectionListSkeleton />
          ) : collections.length === 0 ? (
            <EmptyCollectionState
              onCreateClick={() => setShowCreateSheet(true)}
            />
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              {collections.map((collection) => {
                const isInCollection = collectionMemberships.has(collection.id);
                const isPending = pendingCollections.has(collection.id);

                return (
                  <CollectionListItem
                    key={collection.id}
                    collection={collection}
                    isInCollection={isInCollection}
                    isLoading={isPending}
                    onToggle={() =>
                      handleToggleCollection(collection, isInCollection)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </SheetModal>

      {/* Create Collection Sheet (nested modal) */}
      <CreateCollectionSheet
        isOpen={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}

export default AddToFavoriteSheet;
