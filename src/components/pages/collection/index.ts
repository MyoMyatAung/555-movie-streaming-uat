/**
 * Collection Components Module Exports
 *
 * Central export point for all collection-related UI components.
 * This barrel file provides a clean import interface for consumers.
 *
 * Usage:
 * ```typescript
 * import {
 *   CollectionCard,
 *   CollectionItemCard,
 *   SelectableCollectionItemCard,
 *   SelectionActionBar,
 *   CreateCollectionSheet,
 *   ManageCollectionSheet,
 *   EditCollectionSheet,
 *   AddToFavoriteSheet,
 *   EmptyState,
 *   ErrorState,
 *   LoadingState,
 * } from '@/components/pages/collection';
 * ```
 *
 * Components:
 * - CollectionCard: Displays a collection in list view
 * - CollectionItemCard: Displays a post/video within a collection
 * - SelectableCollectionItemCard: Selectable version for batch removal mode
 * - SelectionActionBar: Bottom action bar for selection mode
 * - CollectionListItem: Displays a collection row in add-to-collection list
 * - CreateCollectionSheet: Modal for creating new collection
 * - ManageCollectionSheet: Modal with collection management options
 * - EditCollectionSheet: Modal for editing collection details
 * - CollectionSettingsSheet: Legacy modal (use ManageCollectionSheet instead)
 * - AddToFavoriteSheet: Modal for adding post to favorites/collections
 * - EmptyState: Empty state for no collections
 * - ErrorState: Error state with retry
 * - LoadingState: Skeleton loading state
 *
 * Note: For delete/remove confirmations, use the reusable ConfirmDialog
 * component from '@/components/common/ui/ConfirmDialog'
 */

// Card Components
export { CollectionCard } from "./CollectionCard";
export type { CollectionCardProps } from "./CollectionCard";

export { CollectionItemCard } from "./CollectionItemCard";
export type { CollectionItemCardProps } from "./CollectionItemCard";

export { SelectableCollectionItemCard } from "./SelectableCollectionItemCard";
export type { SelectableCollectionItemCardProps } from "./SelectableCollectionItemCard";

export { SelectionActionBar } from "./SelectionActionBar";
export type { SelectionActionBarProps } from "./SelectionActionBar";

export { CollectionListItem } from "./CollectionListItem";
export type { CollectionListItemProps } from "./CollectionListItem";

// Sheet Modal Components - Collection Management
export { CreateCollectionSheet } from "./CreateCollectionSheet";
export type { CreateCollectionSheetProps } from "./CreateCollectionSheet";

export { ManageCollectionSheet } from "./ManageCollectionSheet";
export type { ManageCollectionSheetProps } from "./ManageCollectionSheet";

export { EditCollectionSheet } from "./EditCollectionSheet";
export type { EditCollectionSheetProps } from "./EditCollectionSheet";

// Legacy - kept for backward compatibility
export { CollectionSettingsSheet } from "./CollectionSettingsSheet";
export type { CollectionSettingsSheetProps } from "./CollectionSettingsSheet";

// Sheet Modal Components - Favorites
export { AddToFavoriteSheet } from "./AddToFavoriteSheet";
export type { AddToFavoriteSheetProps } from "./AddToFavoriteSheet";

// State Components
export { EmptyState, CollectionItemsEmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";

export { ErrorState } from "./ErrorState";
export type { ErrorStateProps } from "./ErrorState";

export { LoadingState, CollectionDetailLoading } from "./LoadingState";

// Default export for backward compatibility
export { CollectionCard as default } from "./CollectionCard";
