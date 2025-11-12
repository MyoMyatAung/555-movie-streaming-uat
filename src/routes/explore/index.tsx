import HomeLayout from "@/components/common/layouts/HomeLayout";
import { MovieCard } from "@/components/common/movies/MovieCard";
import { Button } from "@/components/ui/button";
import { mockContentSections } from "@/data/mockMovies";
import { createFileRoute } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/explore/")({
  component: RouteComponent,
});

// Filter options
const categoryFilters = [
  "All",
  "Actions",
  "Comedy",
  "Romance",
  "Melo",
  "Anime",
];
const countryFilters = [
  "All",
  "Chinese",
  "Korean",
  "Thailand",
  "Japanese",
  "Thai",
];
const yearFilters = ["All", "2025", "2024", "2023", "2022", "2021", "2020"];
const sortFilters = ["Comprehensive", "Popular", "Rating", "Latest"];

function RouteComponent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Comprehensive");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const expandedFiltersRef = useRef<HTMLDivElement>(null);

  // Get all items from mock data
  const allItems = mockContentSections.flatMap((section) => section.items);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const expandedFilters = expandedFiltersRef.current;
    if (!scrollContainer || !expandedFilters) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = scrollContainer.scrollTop;
          const expandedFiltersHeight = expandedFilters.offsetHeight;

          setIsScrolled((prev) => {
            // Show collapsed bar when scrolled past the expanded filters
            if (!prev && scrollTop > expandedFiltersHeight - 10) {
              return true;
            }
            // Hide collapsed bar when scrolled back above expanded filters
            if (prev && scrollTop < expandedFiltersHeight - 50) {
              return false;
            }
            return prev; // Hysteresis zone to prevent flickering
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const handleItemClick = (itemId: string) => {
    console.log("Item clicked:", itemId);
    // TODO: Navigate to detail page
  };

  return (
    <HomeLayout noHeader>
      <div className="flex h-full flex-col">
        {/* Header - Sticky Top Navigation and Category Tabs */}
        <div className="sticky top-0 z-20">
          {/* Collapsed Filter Bar - Behind category tabs */}
          <div
            className={`absolute top-full right-0 left-0 z-0 bg-linear-to-b from-[#141416] to-[#1F1F1F]/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
              isScrolled
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
          >
            <div className="scrollbar-hide flex h-12 items-center gap-2 overflow-x-auto px-4">
              <span className="shrink-0 text-sm text-white/80">
                Category • Country • Year • Sort
              </span>
              <Button className="shrink-0 rounded-full bg-white/10 p-2 hover:bg-white/20">
                <svg
                  className="size-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </Button>
            </div>
          </div>

          <div className="relative z-10 bg-linear-to-b from-[#141416] to-[#1F1F1F]/95 backdrop-blur-sm">
            {/* Top Navigation */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex gap-6">
                <button className="text-lg font-semibold text-white">
                  Library
                </button>
                <button className="text-lg font-normal text-white/60">
                  Album
                </button>
                <button className="text-lg font-normal text-white/60">
                  Weekly List
                </button>
                <button className="text-lg font-normal text-white/60">
                  Ranking
                </button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
              >
                <SearchIcon className="size-5 text-white" />
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="scrollbar-hide overflow-x-auto px-4">
              <div className="flex gap-6 border-b border-white/10 pb-2">
                {["All", "Movies", "TV Series", "Documentary", "Animation"].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={`pb-2 text-base font-medium whitespace-nowrap ${
                        tab === "All"
                          ? "border-b-2 border-blue-500 text-white"
                          : "text-white/60"
                      }`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {/* Expanded Filters - Part of scrollable content */}
          <div
            ref={expandedFiltersRef}
            className="bg-linear-to-b from-[#141416] to-[#1F1F1F]/95 backdrop-blur-sm"
          >
            <div className="space-y-3 px-4 py-4">
              {/* Category Filters */}
              <div className="scrollbar-hide flex gap-2 overflow-x-auto">
                {categoryFilters.map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => setSelectedCategory(filter)}
                    className={`shrink-0 rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === filter
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {filter}
                  </Button>
                ))}
              </div>

              {/* Country Filters */}
              <div className="scrollbar-hide flex gap-2 overflow-x-auto">
                {countryFilters.map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => setSelectedCountry(filter)}
                    className={`shrink-0 rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                      selectedCountry === filter
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {filter}
                  </Button>
                ))}
              </div>

              {/* Year Filters */}
              <div className="scrollbar-hide flex gap-2 overflow-x-auto">
                {yearFilters.map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => setSelectedYear(filter)}
                    className={`shrink-0 rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                      selectedYear === filter
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {filter}
                  </Button>
                ))}
              </div>

              {/* Sort Filters */}
              <div className="scrollbar-hide flex gap-2 overflow-x-auto">
                {sortFilters.map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => setSelectedSort(filter)}
                    className={`shrink-0 rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                      selectedSort === filter
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              {allItems.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item.id)}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
