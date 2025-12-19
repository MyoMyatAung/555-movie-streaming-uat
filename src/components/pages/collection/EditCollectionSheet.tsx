/**
 * EditCollectionSheet Component
 *
 * Bottom sheet modal for editing an existing collection.
 * Allows updating cover image, title, and privacy settings.
 *
 * Features:
 * - Cover image upload with preview and remove
 * - Title editing with floating label
 * - Public/private toggle
 * - Form validation
 * - Loading state during submission
 * - Back navigation support
 * - File upload via multipart/form-data
 *
 * Design:
 * - Matches the Create Collection sheet design for consistency
 * - Includes back arrow for navigation to previous sheet
 * - Pre-populates form with existing collection data
 *
 * @example
 * ```tsx
 * <EditCollectionSheet
 *   isOpen={showEdit}
 *   onClose={() => setShowEdit(false)}
 *   collection={currentCollection}
 *   onBack={() => setShowManage(true)}
 *   onSuccess={(updated) => {
 *     // Handle successful update
 *   }}
 * />
 * ```
 */

import { useUpdateCollection } from "@/apis/collection";
import SheetModal from "@/components/common/SheetModal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Collection } from "@/types/collection";
import {
  ArrowLeftIcon,
  GlobeIcon,
  ImageIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
// Note: XIcon is used both in image remove button and custom header close button

// =============================================================================
// Types
// =============================================================================

export interface EditCollectionSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Collection to edit */
  collection: Collection;
  /** Back navigation handler (optional) */
  onBack?: () => void;
  /** Success callback with updated collection */
  onSuccess?: (collection: Collection) => void;
}

// =============================================================================
// Component
// =============================================================================

/**
 * EditCollectionSheet
 *
 * Renders a bottom sheet modal for editing collection details.
 * Form includes cover image, title, and public/private toggle.
 */
export function EditCollectionSheet({
  isOpen,
  onClose,
  collection,
  onBack,
  onSuccess,
}: EditCollectionSheetProps) {
  const { mutate: updateCollection, isPending } = useUpdateCollection();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------------------------------------------------------------------------
  // Form State
  // ---------------------------------------------------------------------------
  const [title, setTitle] = useState(collection.name);
  const [isPublic, setIsPublic] = useState(collection.is_public);
  const [coverImage, setCoverImage] = useState<string | null>(
    collection.thumbnail_url || null,
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  // ---------------------------------------------------------------------------
  // Sync form when collection changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    setTitle(collection.name);
    setIsPublic(collection.is_public);
    setCoverImage(collection.thumbnail_url || null);
    setCoverFile(null);
    setRemoveThumbnail(false);
  }, [collection]);

  // ---------------------------------------------------------------------------
  // Form Validation
  // ---------------------------------------------------------------------------
  const isValid = title.trim().length > 0;

  // Check if any changes were made
  const hasChanges =
    title.trim() !== collection.name ||
    isPublic !== collection.is_public ||
    coverFile !== null ||
    (removeThumbnail && collection.thumbnail_url);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * Reset form and close sheet
   */
  const handleClose = () => {
    if (!isPending) {
      // Reset to original values
      setTitle(collection.name);
      setIsPublic(collection.is_public);
      setCoverImage(collection.thumbnail_url || null);
      setCoverFile(null);
      setRemoveThumbnail(false);
      onClose();
    }
  };

  /**
   * Navigate back to manage sheet
   */
  const handleBack = () => {
    if (!isPending && onBack) {
      handleClose();
      onBack();
    }
  };

  /**
   * Open file picker for image selection
   */
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle file selection with validation
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setCoverFile(file);
      setRemoveThumbnail(false);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Remove selected/existing cover image
   */
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverImage(null);
    setCoverFile(null);
    setRemoveThumbnail(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Submit form and update collection
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || !hasChanges || isPending) return;

    // Build request data
    // If we have a new file, include it for multipart upload
    // Otherwise, just send the text fields
    const requestData = coverFile
      ? {
          collection_id: collection.id,
          name: title.trim(),
          is_public: isPublic,
          thumbnail: coverFile,
        }
      : {
          collection_id: collection.id,
          name: title.trim(),
          is_public: isPublic,
          // Note: API doesn't support removing thumbnail via URL
          // Would need a separate endpoint or null value support
        };

    updateCollection(requestData, {
      onSuccess: (response) => {
        toast.success("Collection updated successfully");
        handleClose();
        onSuccess?.(response.data.collection);
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to update collection. Please try again.",
        );
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Custom Header with Back Button
  // ---------------------------------------------------------------------------
  const renderCustomHeader = () => (
    <div className="relative mb-4 flex items-center justify-center px-4 py-3">
      {/* Back Button - Positioned absolute left */}
      {onBack && (
        <button
          type="button"
          onClick={handleBack}
          disabled={isPending}
          className="absolute left-4 flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-50"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="size-5 text-white" />
        </button>
      )}

      {/* Title - Centered */}
      <h2 className="text-[20px] font-medium text-white">Edit Collection</h2>

      {/* Close Button - Positioned absolute right */}
      <button
        type="button"
        onClick={handleClose}
        disabled={isPending}
        className="absolute right-4 flex size-10 items-center justify-center rounded-full bg-white/4 transition-colors hover:bg-white/8 disabled:opacity-50"
        aria-label="Close"
      >
        <XIcon className="size-5 text-white/80" />
      </button>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <SheetModal
      showModal={isOpen}
      setShowModal={(show) => !show && handleClose()}
      title="Edit Collection"
      onClose={handleClose}
      containerClassName="!bg-dark-gray"
      disableDrag
      customHeader={onBack ? renderCustomHeader() : undefined}
    >
      <form onSubmit={handleSubmit} className="px-4 pb-8">
        {/* Cover Image Upload */}
        <div className="mb-6 flex justify-center">
          <div
            onClick={handleImageClick}
            className="relative aspect-video w-3/4 cursor-pointer overflow-hidden rounded-xl bg-[#3A3A3A] transition-colors hover:bg-[#454545]"
          >
            {coverImage ? (
              <>
                <img
                  src={coverImage}
                  alt="Collection cover"
                  className="h-full w-full object-cover"
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                  aria-label="Remove image"
                >
                  <XIcon className="size-4" />
                </button>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="flex size-16 items-center justify-center rounded-lg bg-[#4A4A4A]">
                  <ImageIcon className="size-8 text-white/50" />
                </div>
              </div>
            )}
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload cover image"
          />
        </div>

        {/* Title Input with floating label */}
        <div className="mb-6">
          <div className="relative">
            <input
              id="edit-collection-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=" "
              maxLength={255}
              className="peer w-full rounded-lg border border-white/10 bg-[#3A3A3A] px-4 pt-6 pb-2 text-white placeholder-transparent transition-colors outline-none focus:border-white/30"
              disabled={isPending}
            />
            <label
              htmlFor="edit-collection-title"
              className="pointer-events-none absolute top-2 left-4 text-xs text-white/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs"
            >
              Title
            </label>
          </div>
        </div>

        {/* Public/Private Toggle */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#3A3A3A]">
              <GlobeIcon className="size-6 text-white/70" />
            </div>
            <div>
              <p className="font-medium text-white">Set collection to public</p>
              <p className="text-sm text-white/50">
                visible to everyone on or off public
              </p>
            </div>
          </div>
          <Switch
            id="edit-collection-public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
            disabled={isPending}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || !hasChanges || isPending}
          className="h-12 w-full rounded-xl bg-[#4A90E2] text-base font-medium text-white hover:bg-[#4A90E2]/90 disabled:bg-[#4A4A4A] disabled:text-white/40"
        >
          {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          {isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </SheetModal>
  );
}

export default EditCollectionSheet;
