/**
 * SelectionActionBar Component
 *
 * Fixed bottom action bar for batch selection operations.
 * Provides "Select All" / "Deselect All" toggle and "Remove" action button.
 *
 * Features:
 * - Fixed position at bottom of screen
 * - Select all / Deselect all toggle based on current selection state
 * - Remove button with selected count
 * - Disabled state when no items selected (for remove button)
 * - Smooth animation for appearance
 *
 * @example
 * ```tsx
 * <SelectionActionBar
 *   selectedCount={selectedIds.size}
 *   totalCount={posts.length}
 *   isAllSelected={selectedIds.size === posts.length}
 *   onSelectAll={handleSelectAll}
 *   onDeselectAll={handleDeselectAll}
 *   onRemove={handleRemove}
 *   isRemoving={isPending}
 * />
 * ```
 */

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

export interface SelectionActionBarProps {
  /** Number of currently selected items */
  selectedCount: number;
  /** Total number of selectable items */
  totalCount: number;
  /** Whether all items are currently selected */
  isAllSelected: boolean;
  /** Handler for "Select All" action */
  onSelectAll: () => void;
  /** Handler for "Deselect All" action */
  onDeselectAll: () => void;
  /** Handler for "Remove" action */
  onRemove: () => void;
  /** Whether removal is in progress */
  isRemoving?: boolean;
}

// =============================================================================
// Component
// =============================================================================

/**
 * SelectionActionBar
 *
 * Renders a fixed bottom bar with selection controls.
 * Toggles between "Select all" and "Deselect All" based on selection state.
 */
export function SelectionActionBar({
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
  onDeselectAll,
  onRemove,
  isRemoving = false,
}: SelectionActionBarProps) {
  const { t } = useTranslation();

  const hasSelection = selectedCount > 0;

  // Toggle handler - select all or deselect all based on current state
  const handleToggleAll = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  // Button text based on selection state
  const toggleButtonText = isAllSelected
    ? t("profile.collection.deselectAll")
    : t("profile.collection.selectAll");

  // Remove button text with count when items selected
  const removeButtonText = hasSelection
    ? `${t("profile.collection.remove")} (${selectedCount})`
    : t("profile.collection.remove");

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#121212] px-4 pb-safe">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 py-4">
        {/* Select All / Deselect All Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleToggleAll}
          disabled={isRemoving || totalCount === 0}
          className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
        >
          {toggleButtonText}
        </Button>

        {/* Remove Button */}
        <Button
          type="button"
          onClick={onRemove}
          disabled={!hasSelection || isRemoving}
          className={cn(
            "flex-1 transition-all",
            hasSelection
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-600/50 text-white/70"
          )}
        >
          {isRemoving && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          {removeButtonText}
        </Button>
      </div>
    </div>
  );
}

export default SelectionActionBar;

