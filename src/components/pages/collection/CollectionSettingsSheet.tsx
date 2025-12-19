/**
 * CollectionSettingsSheet Component
 *
 * Bottom sheet modal for managing collection settings.
 * Allows editing name, description, visibility, and deletion.
 *
 * Features:
 * - Edit collection metadata
 * - Toggle public/private
 * - Delete collection with confirmation
 * - Loading states for all actions
 *
 * @example
 * ```tsx
 * <CollectionSettingsSheet
 *   isOpen={showSettings}
 *   onClose={() => setShowSettings(false)}
 *   collection={currentCollection}
 *   onDeleted={() => navigate("/profile/collection")}
 * />
 * ```
 */

import {
  useDeleteCollection,
  useShareCollection,
  useUpdateCollection,
} from "@/apis/collection";
import SheetModal from "@/components/common/SheetModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Collection } from "@/types/collection";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// =============================================================================
// Types
// =============================================================================

export interface CollectionSettingsSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Collection to edit */
  collection: Collection;
  /** Callback when collection is deleted */
  onDeleted?: () => void;
  /** Callback when collection is updated */
  onUpdated?: (collection: Collection) => void;
}

// =============================================================================
// Component
// =============================================================================

/**
 * CollectionSettingsSheet
 *
 * Renders a bottom sheet modal for editing collection settings.
 * Provides form for updating and button for deleting the collection.
 */
export function CollectionSettingsSheet({
  isOpen,
  onClose,
  collection,
  onDeleted,
  onUpdated,
}: CollectionSettingsSheetProps) {
  // Mutations
  const { mutate: updateCollection, isPending: isUpdating } =
    useUpdateCollection();
  const { mutate: deleteCollection, isPending: isDeleting } =
    useDeleteCollection();
  const { mutate: shareCollection, isPending: isSharing } =
    useShareCollection();

  // Form state
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description ?? "");
  const [isPublic, setIsPublic] = useState(collection.is_public);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync form state when collection changes
  useEffect(() => {
    setName(collection.name);
    setDescription(collection.description ?? "");
    setIsPublic(collection.is_public);
  }, [collection]);

  // Form validation
  const isValid = name.trim().length > 0;
  const hasChanges =
    name.trim() !== collection.name ||
    (description.trim() || null) !== (collection.description ?? null) ||
    isPublic !== collection.is_public;

  const isLoading = isUpdating || isDeleting || isSharing;

  // Handle close
  const handleClose = () => {
    if (!isLoading) {
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  // Handle save changes
  const handleSave = () => {
    if (!isValid || !hasChanges || isLoading) return;

    // Check if visibility changed
    if (isPublic !== collection.is_public) {
      shareCollection(
        { collection_id: collection.id, is_public: isPublic },
        {
          onSuccess: () => {
            // If other changes, update them too
            if (
              name.trim() !== collection.name ||
              (description.trim() || null) !== (collection.description ?? null)
            ) {
              updateOtherFields();
            } else {
              toast.success("Collection updated successfully");
              handleClose();
            }
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update visibility");
          },
        },
      );
    } else {
      updateOtherFields();
    }
  };

  // Update name and description
  const updateOtherFields = () => {
    updateCollection(
      {
        collection_id: collection.id,
        name: name.trim(),
        description: description.trim() || undefined,
      },
      {
        onSuccess: (response) => {
          toast.success("Collection updated successfully");
          handleClose();
          onUpdated?.(response.data.collection);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update collection");
        },
      },
    );
  };

  // Handle delete
  const handleDelete = () => {
    if (isLoading) return;

    deleteCollection(
      { collection_id: collection.id },
      {
        onSuccess: () => {
          toast.success("Collection deleted successfully");
          handleClose();
          onDeleted?.();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete collection");
        },
      },
    );
  };

  return (
    <SheetModal
      showModal={isOpen}
      setShowModal={(show) => !show && handleClose()}
      title="Collection Settings"
      onClose={handleClose}
      disableDrag
    >
      <div className="px-4 pb-8">
        {/* Delete Confirmation View */}
        {showDeleteConfirm ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-500/10">
              <Trash2Icon className="size-8 text-red-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-white">
              Delete Collection?
            </h3>
            <p className="mb-6 text-sm text-white/60">
              This action cannot be undone. All videos will be removed from this
              collection, but won't be deleted.
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-white/20 text-white"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        ) : (
          /* Edit Form View */
          <>
            {/* Collection Name */}
            <div className="mb-4">
              <Label htmlFor="edit-name" className="mb-2 block text-white/70">
                Name *
              </Label>
              <Input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
                maxLength={255}
                className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <Label
                htmlFor="edit-description"
                className="mb-2 block text-white/70"
              >
                Description
              </Label>
              <Input
                id="edit-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                maxLength={1000}
                className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                disabled={isLoading}
              />
            </div>

            {/* Public/Private Toggle */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Label htmlFor="edit-public" className="text-white">
                  Make Public
                </Label>
                <p className="text-sm text-white/50">
                  Others can discover this collection
                </p>
              </div>
              <Switch
                id="edit-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Save Button */}
              <Button
                type="button"
                disabled={!isValid || !hasChanges || isLoading}
                className="bg-primary hover:bg-primary/90 w-full"
                onClick={handleSave}
              >
                {(isUpdating || isSharing) && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                {isUpdating || isSharing ? "Saving..." : "Save Changes"}
              </Button>

              {/* Delete Button */}
              <Button
                type="button"
                variant="ghost"
                className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-400"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
              >
                <Trash2Icon className="mr-2 size-4" />
                Delete Collection
              </Button>
            </div>
          </>
        )}
      </div>
    </SheetModal>
  );
}

export default CollectionSettingsSheet;
