/**
 * ManageCollectionSheet Component
 *
 * Bottom sheet modal that displays collection management options.
 * Acts as the main entry point for collection management actions.
 *
 * Features:
 * - Edit collection (title, cover, privacy)
 * - Select items to remove from collection
 * - Delete collection
 * - Clean menu-style interface
 *
 * Architecture:
 * - This component only handles navigation between different actions
 * - Actual functionality is delegated to specific sheet components
 * - Follows Single Responsibility Principle
 *
 * @example
 * ```tsx
 * <ManageCollectionSheet
 *   isOpen={showManage}
 *   onClose={() => setShowManage(false)}
 *   collection={currentCollection}
 *   onEditClick={() => setShowEdit(true)}
 *   onSelectItemsClick={() => setShowSelectItems(true)}
 *   onDeleteClick={() => setShowDelete(true)}
 * />
 * ```
 */

import SheetModal from "@/components/common/SheetModal";
import { PencilIcon, ListChecksIcon, Trash2Icon, ChevronRightIcon } from "lucide-react";
import type { Collection } from "@/types/collection";

// =============================================================================
// Types
// =============================================================================

export interface ManageCollectionSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Collection being managed */
  collection: Collection;
  /** Handler for edit option */
  onEditClick: () => void;
  /** Handler for select items option */
  onSelectItemsClick?: () => void;
  /** Handler for delete option */
  onDeleteClick: () => void;
}

/**
 * Menu item configuration for the management options
 */
interface MenuItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

// =============================================================================
// Sub-components
// =============================================================================

/**
 * ManageMenuItem
 *
 * Single menu item row with icon, title, description, and chevron.
 */
interface ManageMenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

function ManageMenuItem({
  icon,
  title,
  description,
  onClick,
  variant = "default",
}: ManageMenuItemProps) {
  const iconBgClass = variant === "danger" ? "bg-red-500/10" : "bg-[#2A2A2A]";
  const iconColorClass = variant === "danger" ? "text-red-400" : "text-white/70";
  const titleColorClass = variant === "danger" ? "text-red-400" : "text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5 active:bg-white/10"
    >
      {/* Icon */}
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-full ${iconBgClass}`}
      >
        <span className={iconColorClass}>{icon}</span>
      </div>

      {/* Text Content */}
      <div className="flex-1 text-left">
        <p className={`font-medium ${titleColorClass}`}>{title}</p>
        <p className="text-sm text-white/50">{description}</p>
      </div>

      {/* Chevron - not shown for danger variant */}
      {variant !== "danger" && (
        <ChevronRightIcon className="size-5 shrink-0 text-white/30" />
      )}
    </button>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * ManageCollectionSheet
 *
 * Renders a bottom sheet with collection management options.
 * Each option navigates to a specific action sheet.
 */
export function ManageCollectionSheet({
  isOpen,
  onClose,
  collection,
  onEditClick,
  onSelectItemsClick,
  onDeleteClick,
}: ManageCollectionSheetProps) {
  // Build menu items based on available handlers
  const menuItems: MenuItem[] = [
    {
      id: "edit",
      icon: <PencilIcon className="size-6" />,
      title: "Edit collection title, cover image & privacy",
      description: "Update title, cover image, and privacy",
      onClick: () => {
        onClose();
        onEditClick();
      },
    },
  ];

  // Add select items option if handler is provided
  if (onSelectItemsClick) {
    menuItems.push({
      id: "select-items",
      icon: <ListChecksIcon className="size-6" />,
      title: "Select items to remove from collection.",
      description: "Select each or all of collection lists.",
      onClick: () => {
        onClose();
        onSelectItemsClick();
      },
    });
  }

  // Add delete option
  menuItems.push({
    id: "delete",
    icon: <Trash2Icon className="size-6" />,
    title: "Delete Collection",
    description: "Permanently remove the collection and all its contents",
    onClick: () => {
      onClose();
      onDeleteClick();
    },
    variant: "danger",
  });

  return (
    <SheetModal
      showModal={isOpen}
      setShowModal={(show) => !show && onClose()}
      title="Manage Collection"
      onClose={onClose}
      containerClassName="!bg-dark-gray"
    >
      <div className="space-y-2 px-4 pb-8">
        {menuItems.map((item) => (
          <ManageMenuItem
            key={item.id}
            icon={item.icon}
            title={item.title}
            description={item.description}
            onClick={item.onClick}
            variant={item.variant}
          />
        ))}
      </div>
    </SheetModal>
  );
}

export default ManageCollectionSheet;

