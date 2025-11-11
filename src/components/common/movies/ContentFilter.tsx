import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ContentCategory } from "@/types/movie";

interface ContentFilterProps {
  categories: ContentCategory[];
  selectedCategory: ContentCategory;
  onCategoryChange: (category: ContentCategory) => void;
  className?: string;
}

const categoryLabels: Record<ContentCategory, string> = {
  all: "All",
  movies: "Movies",
  tv_series: "TV Series",
  animations: "Animations",
};

export function ContentFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
}: ContentFilterProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
      {categories.map((category) => {
        const isSelected = category === selectedCategory;
        return (
          <Button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "rounded-full text-sm font-medium whitespace-nowrap transition-all",
              isSelected
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white",
            )}
          >
            {categoryLabels[category]}
          </Button>
        );
      })}
    </div>
  );
}
