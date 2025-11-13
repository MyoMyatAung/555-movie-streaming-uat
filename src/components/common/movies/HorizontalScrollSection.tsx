import type { ContentSection } from "@/types/movie";
import { useTranslation } from "react-i18next";
import { MovieCard } from "./MovieCard";

interface HorizontalScrollSectionProps {
  section: ContentSection;
  onSeeAll?: (sectionId: string) => void;
  onItemClick?: (itemId: string) => void;
  className?: string;
}

export function HorizontalScrollSection({
  section,
  onSeeAll,
  onItemClick,
  className,
}: HorizontalScrollSectionProps) {
  const { t } = useTranslation();

  return (
    <div className={className}>
      {/* Section Header */}
      <div className="mb-2 flex items-center justify-between px-4">
        <h3 className="text-lg font-semibold text-white">{section.title}</h3>
        {section.showSeeAll && (
          <button
            onClick={() => onSeeAll?.(section.id)}
            className="text-primary-blue hover:text-primary-blue/80 flex items-center gap-1 text-sm"
          >
            {t("pages.home.sections.seeAll")}
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="scrollbar-hide overflow-x-auto px-4 py-2">
        <div className="flex gap-2.5">
          {section.items.map((item) => (
            <div key={item.id} className="last:pr-4">
              <MovieCard item={item} onClick={() => onItemClick?.(item.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
