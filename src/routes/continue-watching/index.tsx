import XIcon from "@/assets/svgs/icon-close.svg?react";
import ListIcon from "@/assets/svgs/icon-select.svg?react";
import HomeLayout from "@/components/common/layouts/HomeLayout";
import PageHeader from "@/components/common/layouts/PageHeader";
import { WatchHistoryCard } from "@/components/common/movies/WatchHistoryCard";
import SheetModal from "@/components/common/SheetModal";
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
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/continue-watching/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSelectionSheet, setShowSelectionSheet] = useState(false);
  const { t } = useTranslation();

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

  // Map grouped data to ContentItem[] (deduplicated by vod_id)
  const getItemsForCategory = (category: DateCategory): ContentItem[] => {
    const watchListItems = groupedByDate.get(category) || [];
    const seenVodIds = new Set<string>();
    const items: ContentItem[] = [];

    for (const watchListItem of watchListItems) {
      // Skip if we've already seen this vod_id in this category
      if (seenVodIds.has(watchListItem.vod_id)) continue;

      const contentItem = watchHistory.find(
        (item) => item.id === watchListItem.vod_id,
      );
      if (contentItem) {
        seenVodIds.add(watchListItem.vod_id);
        items.push(contentItem);
      }
    }

    return items;
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
    const newSelectionMode = !isSelectionMode;
    setIsSelectionMode(newSelectionMode);
    setShowSelectionSheet(newSelectionMode);
    if (!newSelectionMode) {
      setSelectedIds([]);
    }
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
      setShowSelectionSheet(false);
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
            title={t("pages.continueWatching.title")}
            onBack={() => navigate({ to: "/home" })}
          />
        }
      >
        <div className="flex h-full flex-col">
          <EmptyState title="There is no history yet." />
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout
      customHeader={
        <PageHeader
          title={t("pages.continueWatching.title")}
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
                    // Find the most recent watchlist item for this vod_id in this category
                    const categoryWatchListItems =
                      groupedByDate.get(category) || [];
                    const currentVideo = categoryWatchListItems
                      .filter(
                        (watchList: { vod_id: string }) =>
                          watchList.vod_id === item.id,
                      )
                      .sort(
                        (a: { updated_at: Date }, b: { updated_at: Date }) =>
                          new Date(b.updated_at).getTime() -
                          new Date(a.updated_at).getTime(),
                      )[0];
                    return (
                      <WatchHistoryCard
                        key={`${item.id}-${category}-${currentVideo?.ep_id || ""}`}
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

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title={t("pages.continueWatching.confirmRemoveTitle")}
          message={t("pages.continueWatching.confirmRemoveMessage")}
          confirmText={t("pages.continueWatching.confirmRemoveButton")}
          cancelText={t("pages.continueWatching.cancelButton")}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      </div>

      {/* Selection Sheet Modal */}
      <SheetModal
        detent="content"
        showModal={showSelectionSheet}
        setShowModal={(value) => {
          setShowSelectionSheet(value);
          if (!value) {
            setIsSelectionMode(false);
            setSelectedIds([]);
          }
        }}
        containerClassName="!bg-[#202229]"
        disableBackdropClick={true}
      >
        <div className="h-[123px] px-4 pt-3">
          <div className="flex gap-3">
            <Button
              onClick={handleSelectAll}
              className="h-11 flex-1 rounded-lg bg-white/10 py-2.5 text-base font-semibold text-white hover:bg-white/20"
            >
              {selectedIds.length === watchHistory.length
                ? t("pages.continueWatching.unselectAll")
                : t("pages.continueWatching.selectAll")}
            </Button>
            <Button
              onClick={handleRemove}
              disabled={selectedIds.length === 0}
              className="bg-primary-blue hover:bg-primary-blue/90 h-11 flex-1 rounded-lg py-2.5 text-base font-semibold text-white disabled:opacity-50"
            >
              {t("pages.continueWatching.remove")}{" "}
              {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
            </Button>
          </div>
        </div>
      </SheetModal>
    </HomeLayout>
  );
}
