/**
 * CreateCollectionSheet Component
 *
 * Bottom sheet modal for creating a new collection.
 * Includes form with cover image, title, and visibility options.
 *
 * Features:
 * - Cover image upload/selection
 * - Form validation
 * - Loading state during submission
 * - Error handling with toast notifications
 * - Auto-close on success
 *
 * @example
 * ```tsx
 * const [showSheet, setShowSheet] = useState(false);
 *
 * <CreateCollectionSheet
 *   isOpen={showSheet}
 *   onClose={() => setShowSheet(false)}
 *   onSuccess={(collection) => {
 *     navigate(`/profile/collection/${collection.id}`);
 *   }}
 * />
 * ```
 */

import SheetModal from "@/components/common/SheetModal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCreateCollection } from "@/apis/collection";
import type { Collection } from "@/types/collection";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2Icon, ImageIcon, XIcon, GlobeIcon } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

export interface CreateCollectionSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Success callback with created collection */
  onSuccess?: (collection: Collection) => void;
}

// =============================================================================
// Component
// =============================================================================

/**
 * CreateCollectionSheet
 *
 * Renders a bottom sheet modal for creating a new collection.
 * Form fields: cover image (optional), title (required), is_public (optional).
 */
export function CreateCollectionSheet({
  isOpen,
  onClose,
  onSuccess,
}: CreateCollectionSheetProps) {
  const { t } = useTranslation();
  const { mutate: createCollection, isPending } = useCreateCollection();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Form validation
  const isValid = title.trim().length > 0;

  // Reset form on close
  const handleClose = () => {
    if (!isPending) {
      setTitle("");
      setIsPublic(true);
      setCoverImage(null);
      setCoverFile(null);
      onClose();
    }
  };

  // Handle image selection
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
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
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove image
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverImage(null);
    setCoverFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || isPending) return;

    // Build request data - include thumbnail file if selected
    const requestData = coverFile
      ? {
          name: title.trim(),
          is_public: isPublic,
          thumbnail: coverFile,
        }
      : {
          name: title.trim(),
          is_public: isPublic,
        };

    createCollection(requestData, {
      onSuccess: (response) => {
        toast.success("Collection created successfully");
        handleClose();
        onSuccess?.(response.data.collection);
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to create collection. Please try again."
        );
      },
    });
  };

  return (
    <SheetModal
      showModal={isOpen}
      setShowModal={(show) => !show && handleClose()}
      title={t("profile.collection.createCollection")}
      onClose={handleClose}
      containerClassName="!bg-dark-gray"
      disableDrag
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
          />
        </div>

        {/* Title Input with floating label */}
        <div className="mb-6">
          <div className="relative">
            <input
              id="collection-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=" "
              maxLength={255}
              className="peer w-full rounded-lg border border-white/10 bg-[#3A3A3A] px-4 pt-6 pb-2 text-white placeholder-transparent outline-none transition-colors focus:border-white/30"
              disabled={isPending}
            />
            <label
              htmlFor="collection-title"
              className="pointer-events-none absolute left-4 top-2 text-xs text-white/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs"
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
            id="collection-public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
            disabled={isPending}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || isPending}
          className="h-12 w-full rounded-xl bg-[#4A90E2] text-base font-medium text-white hover:bg-[#4A90E2]/90 disabled:bg-[#4A4A4A] disabled:text-white/40"
        >
          {isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          {isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </SheetModal>
  );
}

export default CreateCollectionSheet;
