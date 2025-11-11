import HomeLayout from "@/components/common/layouts/HomeLayout";
import { ContentFilter } from "@/components/common/movies/ContentFilter";
import { ContinueWatchingSection } from "@/components/common/movies/ContinueWatchingSection";
import { HeroBanner } from "@/components/common/movies/HeroBanner";
import { HorizontalScrollSection } from "@/components/common/movies/HorizontalScrollSection";
import HomePageSkeleton from "@/components/common/skeletons/HomePageSkeleton";
import { mockContentSections, mockHeroBanners } from "@/data/mockMovies";
import type { ContentCategory, HeroBannerItem } from "@/types/movie";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<ContentCategory>("all");

  // Simulate loading data
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const categories: ContentCategory[] = [
    "all",
    "movies",
    "tv_series",
    "animations",
  ];

  // Separate continue watching section
  const continueWatchingSection = mockContentSections.find(
    (section) => section.id === "continue-watching",
  );

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
    // TODO: Navigate to section detail page
    console.log("See all:", sectionId);
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
        <div className="min-h-screen bg-gradient-to-b from-[#141416] to-[#1F1F1F] pb-6">
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
            {/* Continue Watching Section */}
            {continueWatchingSection && (
              <ContinueWatchingSection
                section={continueWatchingSection}
                onSeeAll={handleSeeAll}
                onItemClick={handleItemClick}
              />
            )}

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
