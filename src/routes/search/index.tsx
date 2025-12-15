import EmptyState from "@/assets/img/empty-state.svg";
import { ContinueWatchingSection } from "@/components/common/movies/ContinueWatchingSection";
import { MoreMovie } from "@/components/common/movies/MoreMovie";
import { MovieCard } from "@/components/common/movies/MovieCard";
import {
  FilterDialog,
  type FilterOptions,
} from "@/components/common/search/FilterDialog";
import { SearchBar } from "@/components/common/search/SearchBar";
import {
  mockContentSections,
  mockMovieTypes,
  mockVideosForWatchlist,
} from "@/data/mockMovies";
import { mockRecentSearches } from "@/data/mockRecentSearch";
import { db } from "@/lib/db";
import type { ContentItem } from "@/types/movie";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowUpLeft, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/search/")({
  component: RouteComponent,
});

function RouteComponent() {
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

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typingQuery, setTypingQuery] = useState("");
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [selectedMovieType, setSelectedMovieType] = useState(mockMovieTypes[0]); // "全部" by default
  const [recentSearches, setRecentSearches] = useState(mockRecentSearches);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    genre: "all",
    origin: "all",
    year: "all",
    sort: "comprehensive",
  });
  const allMockItems = mockContentSections.flatMap((section) => section.items);

  const watchListVideos = useMemo<ContentItem[]>(() => {
    if (!watchListData || watchListData.length === 0) return [];

    return allMockItems.filter((item) =>
      watchListData.some(
        (watchList: { vod_id: string }) => watchList.vod_id === item.id,
      ),
    );
  }, [watchListData, allMockItems]);

  const handleItemClick = (itemId: string) => {
    // TODO: Navigate to item detail page
    console.log("Item clicked:", itemId);
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    setTypingQuery("");
    setIsSearchSubmitted(true);
  };

  const onSearch = (query: string) => {
    setSearchQuery(query);
    setTypingQuery("");
    setIsSearchSubmitted(true);
  };

  const onTyping = (query: string) => {
    setTypingQuery(query);
    if (!query) {
      setIsSearchSubmitted(false);
      setSearchQuery("");
    }
  };

  const handleRecommendedItemClick = (item: string) => {
    setSearchQuery(item);
    setTypingQuery("");
    setIsSearchSubmitted(true);
  };

  const handleFilterClick = () => {
    setIsFilterDialogOpen(true);
  };

  // Generate recommended list based on typing query
  const recommendedList = useMemo(() => {
    if (!typingQuery) return [];

    const allTitles = [...new Set(allMockItems.map((item) => item.title))];
    return allTitles
      .filter((title) =>
        title.toLowerCase().includes(typingQuery.toLowerCase()),
      )
      .slice(0, 5); // Limit to 5 recommendations
  }, [typingQuery, allMockItems]);

  // Filter search results by movie type
  const searchResults = useMemo(() => {
    if (!isSearchSubmitted || !searchQuery) return [];

    let results = mockVideosForWatchlist.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Filter by movie type if not "全部" (All)
    if (selectedMovieType !== mockMovieTypes[0]) {
      const typeMap: Record<string, string> = {
        电影: "movie",
        电视剧: "tv_series",
        动画: "animation",
        纪录片: "documentary",
      };
      const filterType = typeMap[selectedMovieType];
      if (filterType) {
        results = results.filter((item) => item.type === filterType);
      }
    }

    return results;
  }, [isSearchSubmitted, searchQuery, selectedMovieType]);

  return (
    <div className="min-h-screen overflow-y-auto pb-24">
      {/* Search Bar */}
      <SearchBar
        onSearch={onSearch}
        onTyping={onTyping}
        showFilterButton={isSearchSubmitted}
        onFilterClick={handleFilterClick}
      />

      {/* Recommended List - shown when typing */}
      {typingQuery && !isSearchSubmitted && recommendedList.length > 0 && (
        <div className="mb-6 px-4">
          {/* <h3 className="mb-3 text-sm font-medium text-white/60">
            {t("search.recommendations") || "Recommendations"}
          </h3> */}
          <div className="space-y-2">
            {recommendedList.map((item, index) => (
              <button
                key={index}
                onClick={() => handleRecommendedItemClick(item)}
                className="flex w-full items-center justify-between border-b border-white/5 px-3 py-2 text-left text-white transition-colors hover:bg-white/10"
              >
                {/* <span className="text-sm">{item}</span> */}
                <Highlighter
                  highlightClassName="text-primary-blue bg-transparent"
                  searchWords={[typingQuery.toLowerCase()]}
                  autoEscape={true}
                  textToHighlight={item}
                />
                <ArrowUpLeft className="h-4 w-4 text-white" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && !typingQuery && !isSearchSubmitted && (
        <div className="mb-6 px-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {t("search.recentSearches") || "Recent Searches"}
            </h3>
            <button
              onClick={() => setRecentSearches([])}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
            >
              <span>{t("search.clearAll") || "Clear All"}</span>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <div
                key={search}
                className="glassmorphism group relative flex items-center gap-2 rounded-full px-4 py-2 transition-all"
              >
                <button
                  onClick={() => handleRecentSearchClick(search)}
                  className="text-sm text-white"
                >
                  {search}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Watching Section */}
      {!typingQuery && !isSearchSubmitted && (
        <ContinueWatchingSection
          watchListFromIndexDB={watchListData}
          watchListVideos={watchListVideos}
          isLoading={isIndexDBLoading}
          onSeeAll={() => navigate({ to: "/continue-watching" })}
          onItemClick={handleItemClick}
        />
      )}

      {/* More Movies Section */}
      {!typingQuery && !isSearchSubmitted && (
        <div className="px-4">
          <h3 className="mb-4 text-lg font-semibold text-white">
            {t("search.recommendedMovies") || "Recommended Movies"}
          </h3>
          <MoreMovie postId={""} />
        </div>
      )}

      {/* Search Results */}
      {isSearchSubmitted && searchQuery && (
        <div className="px-4">
          {/* Movie Types Filter */}
          <div className="mb-4">
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
              {mockMovieTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMovieType(type)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm transition-all ${
                    selectedMovieType === type
                      ? "glassmorphism-primary-blue text-white"
                      : "glassmorphism text-white/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <h3 className="mb-3 text-sm font-medium text-white/60">
            {t("search.results") || "Search Results"} ({searchResults.length})
          </h3>

          {/* Search Results Grid */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {searchResults.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-52 flex flex-col items-center justify-center">
              <img
                src={EmptyState}
                alt="No Result"
                width={100}
                height={100}
                className="mb-4"
              />
              <p className="text-center text-white/60">
                {t("search.noResults") || "No Search Results Found"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Filter Dialog */}
      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
