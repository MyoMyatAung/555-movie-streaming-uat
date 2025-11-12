import HomeLayout from "@/components/common/layouts/HomeLayout";
import { ContentFilter } from "@/components/common/movies/ContentFilter";
import { ContinueWatchingSection } from "@/components/common/movies/ContinueWatchingSection";
import { HeroBanner } from "@/components/common/movies/HeroBanner";
import { HorizontalScrollSection } from "@/components/common/movies/HorizontalScrollSection";
import HomePageSkeleton from "@/components/common/skeletons/HomePageSkeleton";
import { mockContentSections, mockHeroBanners } from "@/data/mockMovies";
import { db } from "@/lib/db";
import type {
  ContentCategory,
  ContentItem,
  HeroBannerItem,
} from "@/types/movie";
import { seedWatchlist } from "@/utils/seedWatchlist";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<ContentCategory>("all");

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

  const isIndexDBLoading = watchListFromIndexDB === undefined;
  const watchListData = watchListFromIndexDB ?? [];

  // Simulate loading data and seed watchlist for development
  useEffect(() => {
    const initData = async () => {
      // Seed watchlist with sample data for development
      await seedWatchlist();

      // Simulate API call
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2 seconds loading time

      return () => clearTimeout(timer);
    };

    initData();
  }, []);

  const categories: ContentCategory[] = [
    "all",
    "movies",
    "tv_series",
    "animations",
  ];

  // Get all items from mock data (this would be replaced with API call)
  const allMockItems = mockContentSections.flatMap((section) => section.items);

  // Filter watch list videos from mock data based on IndexedDB
  const watchListVideos = useMemo<ContentItem[]>(() => {
    if (!watchListData || watchListData.length === 0) return [];

    return allMockItems.filter((item) =>
      watchListData.some(
        (watchList: { vod_id: string }) => watchList.vod_id === item.id,
      ),
    );
  }, [watchListData, allMockItems]);

  // Filter other content sections based on selected category
  const filteredSections = mockContentSections
    .filter((section) => section.id !== "continue-watching")
    .map((section) => ({
      ...section,
      items:
        selectedCategory === "all"
          ? section.items
          : section.items.filter((item) => {
              if (selectedCategory === "movies") return item.type === "movie";
              if (selectedCategory === "tv_series")
                return item.type === "tv_series";
              if (selectedCategory === "animations")
                return item.type === "animation";
              return true;
            }),
    }));

  const handleWatchNow = (item: HeroBannerItem) => {
    // TODO: Navigate to watch page or open player
    console.log("Watch now:", item);
  };

  const handleSeeAll = (sectionId: string) => {
    if (sectionId === "continue-watching") {
      navigate({ to: "/continue-watching" });
    } else {
      // TODO: Navigate to other section detail pages
      console.log("See all:", sectionId);
    }
  };

  const handleItemClick = (itemId: string) => {
    // TODO: Navigate to item detail page
    console.log("Item clicked:", itemId);
  };

  return (
    <HomeLayout isLoading={isLoading}>
      {isLoading ? (
        <HomePageSkeleton />
      ) : (
        <div className="min-h-screen pb-6">
          {/* Content Filters */}
          <div className="px-4 pt-4">
            <ContentFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Hero Banner */}
          <div className="px-4 pt-4">
            <HeroBanner items={mockHeroBanners} onWatchNow={handleWatchNow} />
          </div>

          {/* Content Sections */}
          <div className="mt-6 space-y-8">
            {/* Continue Watching Section - from IndexedDB */}
            <ContinueWatchingSection
              title="Continue Watching"
              watchListFromIndexDB={watchListData}
              watchListVideos={watchListVideos}
              isLoading={isIndexDBLoading}
              onSeeAll={() => navigate({ to: "/continue-watching" })}
              onItemClick={handleItemClick}
            />

            {/* Other Sections */}
            {filteredSections.map((section) => (
              <HorizontalScrollSection
                key={section.id}
                section={section}
                onSeeAll={handleSeeAll}
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      )}
    </HomeLayout>
  );
}
