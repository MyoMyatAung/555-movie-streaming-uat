/**
 * Collection Detail Route
 *
 * Displays a single collection with its posts/videos.
 * Provides functionality to manage collection settings and navigate to player.
 *
 * Features:
 * - Fetches collection details from API with React Query
 * - Loading skeleton state
 * - Error state with retry functionality
 * - Empty state when collection has no posts
 * - Multi-sheet management flow (Manage -> Edit)
 * - Delete confirmation dialog
 * - Selection mode for batch removal of items
 * - Click to play videos
 *
 * UI Flow:
 * 1. Settings button opens ManageCollectionSheet
 * 2. "Edit" option opens EditCollectionSheet (with back to Manage)
 * 3. "Delete" option opens ConfirmDialog for confirmation
 * 4. "Select items" enables selection mode with batch removal
 *
 * Selection Mode Flow:
 * 1. User clicks "Select items to remove" in ManageCollectionSheet
 * 2. Page enters selection mode (header shows X button to exit)
 * 3. User can select/deselect items by clicking
 * 4. User can select all / deselect all via bottom bar
 * 5. User clicks "Remove" to show confirmation dialog
 * 6. On confirm, selected items are removed from collection
 *
 * Route: /profile/collection/:slug
 *
 * @see useCollectionDetail for data fetching
 * @see CollectionItemCard for individual post display
 * @see SelectableCollectionItemCard for selection mode
 * @see SelectionActionBar for batch actions
 */

import { useState, useCallback, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { XIcon, ListChecksIcon } from "lucide-react";
import IconSettings from "@/assets/svgs/icon-settings.svg?react";
import NestedLayout from "@/components/common/layouts/NestedLayout";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ui/ConfirmDialog";
import {
  useCollectionDetail,
  useDeleteCollection,
  useRemovePostsFromCollectionBatch,
} from "@/apis/collection";
import { useRemoveFavouriteBatch } from "@/apis/favourite";
import { useAuth } from "@/hooks/useAuth";
import {
  CollectionItemCard,
  SelectableCollectionItemCard,
  SelectionActionBar,
  ManageCollectionSheet,
  EditCollectionSheet,
  CollectionItemsEmptyState,
  ErrorState,
  CollectionDetailLoading,
} from "@/components/pages/collection";
import { isFavoriteCollection } from "@/types/collection";

// =============================================================================
// Route Definition
// =============================================================================

export const Route = createFileRoute("/profile/collection/$slug")({
  component: CollectionDetailPage,
});

// =============================================================================
// Page Component
// =============================================================================

/**
 * CollectionDetailPage
 *
 * Main page component for the collection detail route.
 * Handles data fetching, post display, and collection management.
 *
 * UI State Management:
 * - showManageSheet: Controls ManageCollectionSheet visibility
 * - showEditSheet: Controls EditCollectionSheet visibility
 * - showDeleteDialog: Controls ConfirmDialog for delete confirmation
 * - isSelectionMode: Whether selection mode is active
 * - selectedIds: Set of selected post IDs
 * - showRemoveDialog: Controls remove confirmation dialog
 *
 * Only one modal should be visible at a time. Navigation between modals
 * is handled by closing current modal before opening the next.
 */
function CollectionDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Get collection ID from route params
  const { slug: collectionId } = Route.useParams();

  // ---------------------------------------------------------------------------
  // UI State Management (Sheets & Dialogs)
  // ---------------------------------------------------------------------------
  const [showManageSheet, setShowManageSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // ---------------------------------------------------------------------------
  // Selection Mode State
  // ---------------------------------------------------------------------------
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCollectionDetail(
    { collection_id: collectionId, page: 1, per_page: 50 },
    { enabled: isAuthenticated && !!collectionId }
  );

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------
  const { mutate: deleteCollection, isPending: isDeleting } = useDeleteCollection();
  const { mutateAsync: removePostsBatch, isPending: isRemovingPosts } =
    useRemovePostsFromCollectionBatch();
  const { mutateAsync: removeFavouritesBatch, isPending: isRemovingFavourites } =
    useRemoveFavouriteBatch();

  // Combined removing state
  const isRemoving = isRemovingPosts || isRemovingFavourites;

  // Extract data from response
  const collection = data?.data.collection;
  const posts = data?.data.posts ?? [];
  const hasPosts = posts.length > 0;

  // Check if this is the "Favorite" collection (can't edit/delete)
  // Check both the route param AND the collection ID from API for robustness
  const isFavorite = collectionId === "favorite" || 
    (collection ? isFavoriteCollection(collection) : false);

  // Selection state computations
  const selectedCount = selectedIds.size;
  const isAllSelected = useMemo(
    () => posts.length > 0 && selectedIds.size === posts.length,
    [posts.length, selectedIds.size]
  );

  // ---------------------------------------------------------------------------
  // Navigation Handlers
  // ---------------------------------------------------------------------------

  /**
   * Navigate to player when clicking a post
   */
  const handlePostClick = useCallback(
    (postId: string) => {
      navigate({ to: "/player/$id", params: { id: postId } });
    },
    [navigate]
  );

  /**
   * Navigate to player when clicking play button
   */
  const handlePlayClick = useCallback(
    (postId: string) => {
      navigate({ to: "/player/$id", params: { id: postId } });
    },
    [navigate]
  );

  // ---------------------------------------------------------------------------
  // Selection Mode Handlers
  // ---------------------------------------------------------------------------

  /**
   * Enter selection mode - called from ManageCollectionSheet
   */
  const handleEnterSelectionMode = useCallback(() => {
    setIsSelectionMode(true);
    setSelectedIds(new Set());
  }, []);

  /**
   * Exit selection mode - clears selection and returns to normal mode
   */
  const handleExitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  /**
   * Toggle selection for a single item
   */
  const handleToggleSelection = useCallback((postId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }, []);

  /**
   * Select all items
   */
  const handleSelectAll = useCallback(() => {
    const allIds = posts.map((post) => post.id);
    setSelectedIds(new Set(allIds));
  }, [posts]);

  /**
   * Deselect all items
   */
  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  /**
   * Open remove confirmation dialog
   */
  const handleOpenRemoveDialog = useCallback(() => {
    if (selectedIds.size === 0) return;
    setShowRemoveDialog(true);
  }, [selectedIds.size]);

  /**
   * Confirm removal of selected items
   * Uses batch removal API for better performance.
   * Uses favourite/remove for Favorite collection, collection/remove-post for others.
   */
  const handleConfirmRemove = useCallback(async () => {
    if (!collection || selectedIds.size === 0 || isRemoving) return;

    const idsToRemove = Array.from(selectedIds);

    try {
      // Use different API based on collection type
      if (isFavorite) {
        // Favorite collection uses favourite/remove endpoint
        const result = await removeFavouritesBatch({ post_id: idsToRemove });

        const successCount = result.data.removed_count;
        const errorCount = result.data.failed_count;

        if (successCount > 0) {
          toast.success(
            t("profile.collection.removeSuccess", { count: successCount })
          );
        }
        if (errorCount > 0) {
          toast.error(
            t("profile.collection.removePartialError", { count: errorCount })
          );
        }
      } else {
        // Regular collection uses collection/remove-post endpoint
        const result = await removePostsBatch({
          collection_id: collection.id,
          post_id: idsToRemove,
        });

        const successCount = result.data.removed_count;
        const errorCount = result.data.failed_count;

        if (successCount > 0) {
          toast.success(
            t("profile.collection.removeSuccess", { count: successCount })
          );
        }
        if (errorCount > 0) {
          toast.error(
            t("profile.collection.removePartialError", { count: errorCount })
          );
        }
      }
    } catch (error) {
      console.error("Failed to remove items:", error);
      toast.error(t("profile.collection.removeError"));
    }

    // Clean up
    setShowRemoveDialog(false);
    setSelectedIds(new Set());
    setIsSelectionMode(false);

    // Refetch to update the list
    refetch();
  }, [
    collection,
    selectedIds,
    isRemoving,
    isFavorite,
    removePostsBatch,
    removeFavouritesBatch,
    t,
    refetch,
  ]);

  /**
   * Cancel remove dialog
   */
  const handleCancelRemove = useCallback(() => {
    if (isRemoving) return;
    setShowRemoveDialog(false);
  }, [isRemoving]);

  // ---------------------------------------------------------------------------
  // Sheet Navigation Handlers
  // ---------------------------------------------------------------------------

  /**
   * Open Manage Collection sheet
   */
  const handleOpenManage = useCallback(() => {
    setShowManageSheet(true);
  }, []);

  /**
   * Open Edit Collection sheet (from Manage)
   */
  const handleOpenEdit = useCallback(() => {
    setShowEditSheet(true);
  }, []);

  /**
   * Open Delete confirmation dialog (from Manage)
   */
  const handleOpenDelete = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  /**
   * Go back to Manage sheet (from Edit)
   */
  const handleBackToManage = useCallback(() => {
    setShowManageSheet(true);
  }, []);

  /**
   * Handle delete confirmation
   * Executes collection deletion API call and navigates back on success
   */
  const handleConfirmDelete = useCallback(() => {
    if (!collection || isDeleting) return;

    deleteCollection(
      { collection_id: collection.id },
      {
        onSuccess: () => {
          toast.success(t("profile.collection.deleteSuccess"));
          setShowDeleteDialog(false);
          navigate({ to: "/profile/collection" });
        },
        onError: (err) => {
          toast.error(err.message || t("profile.collection.deleteError"));
        },
      }
    );
  }, [collection, isDeleting, deleteCollection, navigate, t]);

  /**
   * Handle delete dialog cancel
   */
  const handleCancelDelete = useCallback(() => {
    if (isDeleting) return; // Prevent closing while deleting
    setShowDeleteDialog(false);
  }, [isDeleting]);

  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------

  /**
   * Render action button for header
   * - In selection mode: X button to exit selection
   * - Favorite collection: List icon button to enter selection mode directly
   * - Regular collection: Settings button to open ManageCollectionSheet
   */
  const renderActionButton = () => {
    // Selection mode: show X button to exit
    if (isSelectionMode) {
      return (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleExitSelectionMode}
          className="rounded-full glassmorphism"
          aria-label="Exit selection mode"
        >
          <XIcon className="size-6 text-white" />
        </Button>
      );
    }

    // Favorite collection: show list icon to enter selection mode directly
    // (since edit/delete is not available for Favorite)
    if (isFavorite && hasPosts) {
      return (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleEnterSelectionMode}
          className="rounded-full glassmorphism"
          aria-label="Select items to remove"
        >
          <ListChecksIcon className="size-6 text-white" />
        </Button>
      );
    }

    // Regular collection: show settings button
    if (!isFavorite) {
      return (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleOpenManage}
          className="rounded-full glassmorphism"
          aria-label="Collection settings"
        >
          <IconSettings className="size-6 text-white" />
        </Button>
      );
    }

    return null;
  };

  // Get page title
  const pageTitle = collection?.name ?? t("profile.collection.title");

  return (
    <NestedLayout
      title={pageTitle}
      isIncludeBack
      actionNode={renderActionButton()}
    >
      {/* Loading State */}
      {isLoading && <CollectionDetailLoading />}

      {/* Error State */}
      {isError && !isLoading && (
        <ErrorState
          title={error?.message}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      )}

      {/* Empty State - No Posts */}
      {!isLoading && !isError && !hasPosts && <CollectionItemsEmptyState />}

      {/* Post List */}
      {!isLoading && !isError && hasPosts && (
        <div className={`flex flex-col gap-y-4 px-4 ${isSelectionMode ? "pb-28" : ""}`}>
          {isSelectionMode ? (
            // Selection mode: show selectable cards
            posts.map((post) => (
              <SelectableCollectionItemCard
                key={post.id}
                item={post}
                isSelected={selectedIds.has(post.id)}
                onToggle={() => handleToggleSelection(post.id)}
              />
            ))
          ) : (
            // Normal mode: show regular cards
            posts.map((post) => (
              <CollectionItemCard
                key={post.id}
                item={post}
                onClick={() => handlePostClick(post.id)}
                onPlayClick={() => handlePlayClick(post.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Selection Mode Action Bar */}
      {isSelectionMode && hasPosts && (
        <SelectionActionBar
          selectedCount={selectedCount}
          totalCount={posts.length}
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onRemove={handleOpenRemoveDialog}
          isRemoving={isRemoving}
        />
      )}

      {/* Sheet Modals - Only for non-favorite collections */}
      {collection && !isFavorite && (
        <>
          {/* Manage Collection Sheet - Main entry point */}
          <ManageCollectionSheet
            isOpen={showManageSheet}
            onClose={() => setShowManageSheet(false)}
            collection={collection}
            onEditClick={handleOpenEdit}
            onSelectItemsClick={handleEnterSelectionMode}
            onDeleteClick={handleOpenDelete}
          />

          {/* Edit Collection Sheet - Opened from Manage */}
          <EditCollectionSheet
            isOpen={showEditSheet}
            onClose={() => setShowEditSheet(false)}
            collection={collection}
            onBack={handleBackToManage}
          />

          {/* Delete Collection Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteDialog}
            title={t("profile.collection.deleteDialogTitle")}
            message={t("profile.collection.deleteDialogMessage")}
            confirmText={t("profile.collection.deleteConfirm")}
            cancelText={t("profile.settings.goBack")}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            confirmButtonClassName="text-red-500 hover:text-red-400"
          />
        </>
      )}

      {/* Remove Selected Items Confirmation Dialog - Available for all collections */}
      <ConfirmDialog
        isOpen={showRemoveDialog}
        title={t("profile.collection.removeDialogTitle")}
        message={t("profile.collection.removeDialogMessage")}
        confirmText={t("profile.collection.removeConfirm")}
        cancelText={t("profile.settings.goBack")}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </NestedLayout>
  );
}

export default CollectionDetailPage;
