/**
 * Collection Empty State Component
 *
 * Displays a friendly empty state when user has no collections.
 * Includes a call-to-action button to create the first collection.
 *
 * Features:
 * - Illustrative icon
 * - Localized title and description
 * - Optional create button
 *
 * @example
 * ```tsx
 * // With create button
 * <EmptyState onCreateClick={() => setShowCreateSheet(true)} />
 *
 * // Without create button (for items)
 * <EmptyState
 *   title="No Videos Yet"
 *   description="Add videos to this collection"
 * />
 * ```
 */

import EmptyFolderIcon from "@/assets/svgs/icon-empty.svg?react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

// =============================================================================
// Types
// =============================================================================

export interface EmptyStateProps {
  /** Custom title (overrides i18n default) */
  title?: string;
  /** Custom description (overrides i18n default) */
  description?: string;
  /** Whether to show the create button */
  showCreateButton?: boolean;
  /** Click handler for create button */
  onCreateClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * EmptyState
 *
 * Renders an empty state with icon, text, and optional action button.
 * Used when the collection list or collection items are empty.
 */
export function EmptyState({
  title,
  description,
  showCreateButton = true,
  onCreateClick,
  className,
}: EmptyStateProps) {
  const { t } = useTranslation();

  const displayTitle = title ?? t("profile.collection.emptyState.title");
  const displayDescription =
    description ?? t("profile.collection.emptyState.description");

  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center px-6 text-center",
        className,
      )}
    >
      {/* Icon */}
      <div className="mb-4">
        <EmptyFolderIcon className="size-24 text-white/30" />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-medium text-white/70">{displayTitle}</h3>

      {/* Description */}
      <p className="mb-6 max-w-xs text-sm text-white/50">
        {displayDescription}
      </p>

      {/* Create Button */}
      {showCreateButton && onCreateClick && (
        <Button
          onClick={onCreateClick}
          className="bg-primary hover:bg-primary/90 gap-x-2"
        >
          <PlusIcon className="size-4" />
          {t("profile.collection.emptyState.createButton")}
        </Button>
      )}
    </div>
  );
}

/**
 * CollectionItemsEmptyState
 *
 * Empty state specifically for when a collection has no items.
 * Different from the main EmptyState as it doesn't show create button.
 */
export function CollectionItemsEmptyState({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center px-6 text-center",
        className,
      )}
    >
      <div className="mb-4">
        <EmptyFolderIcon className="size-20 text-white/30" />
      </div>

      <h3 className="mb-2 text-base font-medium text-white/70">
        No Videos Yet
      </h3>

      <p className="max-w-xs text-sm text-white/50">
        Add videos to this collection to see them here
      </p>
    </div>
  );
}

export default EmptyState;
