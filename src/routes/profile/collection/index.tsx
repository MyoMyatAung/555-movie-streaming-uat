/**
 * Collection List Route
 *
 * Displays the user's collections with the virtual "Favorite" collection first.
 * Provides functionality to create new collections and navigate to collection details.
 *
 * Features:
 * - Fetches collections from API with React Query
 * - Loading skeleton state
 * - Error state with retry functionality
 * - Empty state with create action
 * - Create collection modal
 *
 * Route: /profile/collection
 *
 * @see useCollectionList for data fetching
 * @see CollectionCard for individual collection display
 */

import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import IconPlus from "@/assets/svgs/icon-plus.svg?react";
import NestedLayout from "@/components/common/layouts/NestedLayout";
import { Button } from "@/components/ui/button";
import { useCollectionList } from "@/apis/collection";
import { useAuth } from "@/hooks/useAuth";
import {
  CollectionCard,
  CreateCollectionSheet,
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/pages/collection";
import { isFavoriteCollection } from "@/types/collection";

// =============================================================================
// Route Definition
// =============================================================================

export const Route = createFileRoute("/profile/collection/")({
  component: CollectionListPage,
});

// =============================================================================
// Page Component
// =============================================================================

/**
 * CollectionListPage
 *
 * Main page component for the collection list route.
 * Handles authentication check, data fetching, and state rendering.
 */
function CollectionListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State for create collection modal
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  // Fetch collections list
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCollectionList(
    { page: 1, per_page: 50 }, // Get up to 50 collections
    { enabled: isAuthenticated }
  );

  // Extract collections from response
  const collections = data?.data.collections ?? [];
  const hasCollections = collections.length > 0;

  // Handle collection card click - navigate to detail page
  const handleCollectionClick = (collectionId: string) => {
    navigate({ to: "/profile/collection/$slug", params: { slug: collectionId } });
  };

  // Handle create collection success
  const handleCreateSuccess = (collection: { id: string }) => {
    // Optionally navigate to the new collection
    // navigate({ to: "/profile/collection/$slug", params: { slug: collection.id } });
  };

  // Render action button for header
  const renderActionButton = () => (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={() => setShowCreateSheet(true)}
      className="rounded-full border border-white/10"
      aria-label={t("profile.collection.createCollection")}
    >
      <IconPlus className="size-6 text-white" />
    </Button>
  );

  return (
    <NestedLayout
      title={t("profile.collection.title")}
      isIncludeBack
      actionNode={renderActionButton()}
    >
      {/* Loading State */}
      {isLoading && <LoadingState />}

      {/* Error State */}
      {isError && !isLoading && (
        <ErrorState
          title={error?.message}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && !hasCollections && (
        <EmptyState
          showCreateButton
          onCreateClick={() => setShowCreateSheet(true)}
        />
      )}

      {/* Collection List */}
      {!isLoading && !isError && hasCollections && (
        <div className="flex flex-col gap-y-2 px-4">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              isDefault={isFavoriteCollection(collection)}
              onClick={() => handleCollectionClick(collection.name.toLowerCase() === "favorite" ? "favorite" : collection.id)} // if collection name is "favorite", navigate to "favorite" route
            />
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      <CreateCollectionSheet
        isOpen={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        onSuccess={handleCreateSuccess}
      />
    </NestedLayout>
  );
}

export default CollectionListPage;
