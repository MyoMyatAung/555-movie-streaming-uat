import { useGetIndexRecommend } from "@/apis/home/queryGetIndexRecommend";
import HomeLayout from "@/components/common/layouts/HomeLayout";
import { ContentFilter } from "@/components/common/movies/ContentFilter";
import { ContinueWatchingSection } from "@/components/common/movies/ContinueWatchingSection";
import { HeroBanner } from "@/components/common/movies/HeroBanner";
import { HorizontalScrollSection } from "@/components/common/movies/HorizontalScrollSection";
import HomePageSkeleton from "@/components/common/skeletons/HomePageSkeleton";
import { mockHeroBanners } from "@/data/mockMovies";
import { db } from "@/lib/db";
import type {
  ContentCategory,
  ContentItem,
  HeroBannerItem,
} from "@/types/movie";
import type { IndexRecommendSection } from "@/types/post";
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

  const { sections: apiSections, isLoading: isApiLoading } =
    useGetIndexRecommend();

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

  // Filter sections based on layout type (only list and carousel)
  const filteredSections = useMemo(() => {
    if (!apiSections || apiSections.length === 0) return [];

    return apiSections.filter((section) => {
      return (
        section.layout === "index_recommend_list" ||
        section.layout === "index_recommend_carousel"
      );
    });
  }, [apiSections]);

  // Get all items from API sections for watchlist filtering
  const allApiItems = useMemo<ContentItem[]>(() => {
    if (!apiSections || apiSections.length === 0) return [];

    const items: ContentItem[] = [];

    apiSections.forEach((section) => {
      if (section.layout === "index_recommend_list") {
        section.list.forEach((item) => {
          items.push({
            id: item.id,
            title: item.name,
            imageUrl: item.cover,
            type: "movie",
            badge: item.label
              ? { type: "highly_recommended", label: item.label }
              : undefined,
            genres: item.type_name ? [item.type_name] : undefined,
          });
        });
      } else if (section.layout === "index_recommend_carousel") {
        section.list.forEach((item, index) => {
          items.push({
            id: `carousel-${index}-${item.title}`,
            title: item.title,
            imageUrl: item.image,
            type: "movie",
            badge: item.label
              ? { type: "highly_recommended", label: item.label }
              : undefined,
          });
        });
      }
    });

    return items;
  }, [apiSections]);

  // Filter watch list videos from API data based on IndexedDB
  const watchListVideos = useMemo<ContentItem[]>(() => {
    if (!watchListData || watchListData.length === 0) return [];

    return allApiItems.filter((item) =>
      watchListData.some(
        (watchList: { vod_id: string }) => watchList.vod_id === item.id,
      ),
    );
  }, [watchListData, allApiItems]);

  const handleWatchNow = (item: HeroBannerItem) => {
    // TODO: Navigate to watch page or open player
    console.log("Watch now:", item);
  };

  const handleSeeAll = (section: IndexRecommendSection) => {
    if (
      section.right &&
      "type" in section.right &&
      section.right.type === "navigator"
    ) {
      const navData = section.right.data;
      if (navData.page === "post_list") {
        // TODO: Navigate to post list page with params
        console.log("Navigate to post list:", navData.param);
      }
    } else {
      console.log("See all:", section);
    }
  };

  const handleItemClick = (itemId: string) => {
    // TODO: Navigate to item detail page
    console.log("Item clicked:", itemId);
  };

  return (
    <HomeLayout isLoading={isLoading || isApiLoading}>
      {isLoading || isApiLoading ? (
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

          {/* Hero Banner - Check for carousel sections */}
          {apiSections.some((s) => s.layout === "index_recommend_carousel") && (
            <div className="px-4 pt-4">
              <HeroBanner items={mockHeroBanners} onWatchNow={handleWatchNow} />
            </div>
          )}

          {/* Content Sections */}
          <div className="mt-6 space-y-8">
            {/* Continue Watching Section - from IndexedDB */}
            <ContinueWatchingSection
              watchListFromIndexDB={watchListData}
              watchListVideos={watchListVideos}
              isLoading={isIndexDBLoading}
              onSeeAll={() => navigate({ to: "/continue-watching" })}
              onItemClick={handleItemClick}
            />

            {/* API Sections */}
            {filteredSections.map((section, index) => (
              <HorizontalScrollSection
                key={`${section.layout}-${index}`}
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
