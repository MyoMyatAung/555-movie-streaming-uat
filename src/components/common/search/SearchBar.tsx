import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onTyping?: (query: string) => void;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
}

export function SearchBar({ onSearch, onTyping, showFilterButton, onFilterClick }: SearchBarProps) {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    navigate({ to: "/" });
  };

  const handleClearSearch = () => {
    setSearchText("");
    onTyping?.("");
  };

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleInputChange = (value: string) => {
    setSearchText(value);
    onTyping?.(value);
  }

  return (
    <div className="z-10 px-4 py-4">
      <div className="flex items-center gap-3">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="glassmorphism flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>

        {/* Search Input */}
        <div className="glassmorphism relative flex flex-1 items-center rounded-full px-4">
          <Search className="h-5 w-5 shrink-0 text-white/60" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder={t("search.placeholder") || "Search movies, series..."}
            className="flex-1 bg-transparent px-2 py-2 text-white placeholder:text-white/50 focus:outline-none"
          />
          {searchText && (
            <button
              onClick={handleClearSearch}
              className="shrink-0 text-white/60 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        {showFilterButton && (
          <button
            onClick={onFilterClick}
            className="glassmorphism flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all"
            aria-label="Filter"
          >
            <SlidersHorizontal className="h-5 w-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
