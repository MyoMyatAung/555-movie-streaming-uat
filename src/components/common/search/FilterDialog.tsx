import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";

export interface FilterOptions {
  genre: string;
  origin: string;
  year: string;
  sort: string;
}

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories?: {
    genres?: Array<{ id: string; name: string }>;
    origins?: Array<{ id: string; name: string }>;
    years?: Array<{ id: string; name: string }>;
  };
  sortOptions?: Array<{ id: string; name: string }>;
}

export function FilterDialog({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  categories,
  sortOptions,
}: FilterDialogProps) {
  const { t } = useTranslation();

  // Default categories (will be replaced by API data)
  const defaultGenres = [
    { id: "all", name: "All" },
    { id: "actions", name: "Actions" },
    { id: "comedy", name: "Comedy" },
    { id: "romance", name: "Romance" },
    { id: "melo", name: "Melo" },
  ];
  const defaultOrigins = [
    { id: "all", name: "All" },
    { id: "chinese", name: "Chinese" },
    { id: "korean", name: "Korean" },
    { id: "thailand", name: "Thailand" },
    { id: "japan", name: "Japan" },
  ];
  const defaultYears = [
    { id: "all", name: "All" },
    { id: "2025", name: "2025" },
    { id: "2024", name: "2024" },
    { id: "2023", name: "2023" },
    { id: "2022", name: "2022" },
    { id: "2021", name: "2021" },
    { id: "2020", name: "2020" },
  ];
  const defaultSortOptions = [
    {
      id: "comprehensive",
      name: t("search.filters.sortOptions.comprehensive") || "Comprehensive",
    },
    {
      id: "hottest",
      name: t("search.filters.sortOptions.hottest") || "Hottest",
    },
    { id: "rating", name: t("search.filters.sortOptions.rating") || "Rating" },
    { id: "newest", name: t("search.filters.sortOptions.newest") || "Newest" },
  ];

  const genres = categories?.genres || defaultGenres;
  const origins = categories?.origins || defaultOrigins;
  const years = categories?.years || defaultYears;
  const sortOpts = sortOptions || defaultSortOptions;

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
          />

          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
            className="fixed inset-0 bottom-0 z-[100] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative my-auto h-[50svh]">
              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 pb-24">
                {/* Categories Section */}
                <div className="mb-8">
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    {t("search.filters.categories") || "Categories"}
                  </h3>

                  {/* Genres */}
                  <div className="mb-6">
                    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
                      {genres.map((genre) => (
                        <button
                          key={genre.id}
                          onClick={() => handleFilterChange("genre", genre.id)}
                          className={cn(
                            "shrink-0 rounded-full px-6 py-3 text-sm font-medium transition-all",
                            filters.genre === genre.id
                              ? "glassmorphism-primary-blue text-white"
                              : "glassmorphism text-white/80",
                          )}
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Origin/Language */}
                  <div className="mb-6">
                    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
                      {origins.map((origin) => (
                        <button
                          key={origin.id}
                          onClick={() =>
                            handleFilterChange("origin", origin.id)
                          }
                          className={cn(
                            "shrink-0 rounded-full px-6 py-3 text-sm font-medium transition-all",
                            filters.origin === origin.id
                              ? "glassmorphism-primary-blue text-white"
                              : "glassmorphism text-white/80",
                          )}
                        >
                          {origin.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Year */}
                  <div className="mb-6">
                    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
                      {years.map((year) => (
                        <button
                          key={year.id}
                          onClick={() => handleFilterChange("year", year.id)}
                          className={cn(
                            "shrink-0 rounded-full px-6 py-3 text-sm font-medium transition-all",
                            filters.year === year.id
                              ? "glassmorphism-primary-blue text-white"
                              : "glassmorphism text-white/80",
                          )}
                        >
                          {year.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sort Section */}
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    {t("search.filters.sort") || "Sort"}
                  </h3>
                  <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
                    {sortOpts.map((sort) => (
                      <button
                        key={sort.id}
                        onClick={() => handleFilterChange("sort", sort.id)}
                        className={cn(
                          "rounded-full px-5 py-3 text-sm font-medium transition-all",
                          filters.sort === sort.id
                            ? "glassmorphism-primary-blue text-white"
                            : "glassmorphism text-white/80",
                        )}
                      >
                        {sort.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="">
                <button
                  onClick={onClose}
                  className="glassmorphism mx-auto flex h-14 w-14 items-center justify-center rounded-full transition-all hover:bg-white/20"
                  aria-label="Close filters"
                >
                  <X className="h-8 w-8 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
