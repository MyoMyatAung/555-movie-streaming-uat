import HomeLayout from "@/components/common/layouts/HomeLayout";
import PageHeader from "@/components/common/layouts/PageHeader";
import { WatchHistoryCard } from "@/components/common/movies/WatchHistoryCard";
import { ConfirmDialog } from "@/components/common/ui/ConfirmDialog";
import { EmptyState } from "@/components/common/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { mockContentSections } from "@/data/mockMovies";
import { db } from "@/lib/db";
import { watchlistService } from "@/services/WatchlistService";
import type { ContentItem } from "@/types/movie";
import { groupByDateCategory, type DateCategory } from "@/utils/dateHelpers";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { ListIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/continue-watching/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Fetch watch list from IndexedDB
  const watchListFromIndexDB = useLiveQuery(() =>
    db.watchList
      .orderBy("updated_at")
      .reverse()
      .toArray()
      .catch((err: unknown) => {
        console.error("Dexie query error:", err);
        return [];
      }),
  );

  const watchListData = watchListFromIndexDB ?? [];

  // Get all items from mock data (this would be replaced with API call)
  const allMockItems = mockContentSections.flatMap((section) => section.items);

  // Filter watch history videos from mock data based on IndexedDB
  const watchHistory = useMemo<ContentItem[]>(() => {
    if (!watchListData || watchListData.length === 0) return [];

    return allMockItems.filter((item) =>
      watchListData.some(
        (watchList: { vod_id: string }) => watchList.vod_id === item.id,
      ),
    );
  }, [watchListData, allMockItems]);

  // Group items by date category
  const groupedByDate = useMemo(() => {
    return groupByDateCategory(watchListData);
  }, [watchListData]);

  // Map grouped data to ContentItem[]
  const getItemsForCategory = (category: DateCategory): ContentItem[] => {
    const watchListItems = groupedByDate.get(category) || [];
    return watchListItems
      .map((watchListItem) =>
        watchHistory.find((item) => item.id === watchListItem.vod_id),
      )
      .filter((item): item is ContentItem => item !== undefined);
  };

  const handleBack = () => {
    if (isSelectionMode) {
      setIsSelectionMode(false);
      setSelectedIds([]);
    } else {
      navigate({ to: "/home" });
    }
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const handleSelect = (itemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === watchHistory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(watchHistory.map((item) => item.id));
    }
  };

  const handleRemove = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = async () => {
    try {
      // Remove selected items from IndexedDB
      const itemsToRemove = selectedIds.map((id) => {
        const watchListItem = watchListData.find(
          (item: { vod_id: string; ep_id?: string }) => item.vod_id === id,
        );
        return {
          videoId: id,
          episodeId: watchListItem?.ep_id,
        };
      });

      await watchlistService.removeMultipleFromWatchlist(itemsToRemove);

      setSelectedIds([]);
      setIsSelectionMode(false);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Failed to remove items from watchlist:", error);
    }
  };

  const handleCancelRemove = () => {
    setShowConfirmDialog(false);
  };

  const handlePlay = (itemId: string) => {
    console.log("Play item:", itemId);
    // TODO: Navigate to player
  };

  // Empty state
  if (watchHistory.length === 0) {
    return (
      <HomeLayout
        customHeader={
          <PageHeader
            title="Continue Watching"
            onBack={() => navigate({ to: "/home" })}
          />
        }
      >
        <div className="flex h-full flex-col bg-gradient-to-b from-[#141416] to-[#1F1F1F]">
          <EmptyState title="There is no history yet." />
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout
      customHeader={
        <PageHeader
          title="Continue Watching"
          onBack={handleBack}
          rightAction={{
            icon: isSelectionMode ? (
              <XIcon className="size-6" />
            ) : (
              <ListIcon className="size-6" />
            ),
            onClick: handleToggleSelectionMode,
          }}
        />
      }
    >
      <div className="flex min-h-full flex-col pb-6">
        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Render sections for each date category */}
          {(
            [
              "Today",
              "Yesterday",
              "This Week",
              "Last Week",
              "This Month",
              "Last Month",
              "Older",
            ] as DateCategory[]
          ).map((category) => {
            const items = getItemsForCategory(category);
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="bg-white/10 px-4 py-1 text-lg font-semibold text-white backdrop-blur-xs">
                  {category}
                </h2>
                <div className="space-y-3 px-4 py-3">
                  {items.map((item) => {
                    const currentVideo = watchListData.find(
                      (watchList: { vod_id: string }) =>
                        watchList.vod_id === item.id,
                    );
                    return (
                      <WatchHistoryCard
                        key={`${item.id}-${currentVideo?.ep_id || ""}`}
                        item={item}
                        watchListItem={currentVideo}
                        isSelected={selectedIds.includes(item.id)}
                        isSelectionMode={isSelectionMode}
                        onSelect={handleSelect}
                        onPlay={handlePlay}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Buttons (only show in selection mode) */}
        {isSelectionMode && (
          <div className="sticky bottom-0 flex gap-3 border-t border-white/10 bg-gradient-to-t from-[#141416] to-[#1F1F1F] px-4 pt-4">
            <Button
              onClick={handleSelectAll}
              className="flex-1 rounded-xl bg-white/10 py-3 text-base font-medium text-white hover:bg-white/20"
            >
              {selectedIds.length === watchHistory.length
                ? "Deselect All"
                : "Select all"}
            </Button>
            <Button
              onClick={handleRemove}
              disabled={selectedIds.length === 0}
              className="flex-1 rounded-xl bg-blue-500 py-3 text-base font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              Remove {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
            </Button>
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title="Remove Selected History ?"
          message="Are sure you want to remove selected watch history ?"
          confirmText="Yes, Remove"
          cancelText="Go back"
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      </div>
    </HomeLayout>
  );
}
