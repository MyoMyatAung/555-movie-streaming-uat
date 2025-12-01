import type { ContentItem } from "@/types/movie";
import type { IndexRecommendSection } from "@/types/post";
import { useTranslation } from "react-i18next";
import { MovieCard } from "./MovieCard";

interface HorizontalScrollSectionProps {
  section: IndexRecommendSection;
  onSeeAll?: (section: IndexRecommendSection) => void;
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

  const hasRightAction = section.right && "text" in section.right;

  // Handle list layout
  if (section.layout === "index_recommend_list") {
    return (
      <div className={className}>
        {/* Section Header */}
        <div className="mb-2 flex items-center justify-between px-4">
          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
          {hasRightAction && (
            <button
              onClick={() => onSeeAll?.(section)}
              className="text-primary-blue hover:text-primary-blue/80 flex items-center gap-1 text-sm"
            >
              {t("pages.home.sections.seeAll")}
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="scrollbar-hide overflow-x-auto px-4 py-2">
          <div className="flex gap-2.5">
            {section.list.map((item) => {
              // Transform to ContentItem format for MovieCard
              const contentItem: ContentItem = {
                id: item.id,
                title: item.name,
                imageUrl: item.cover,
                type: "movie",
                badge: item.label
                  ? { type: "highly_recommended", label: item.label }
                  : undefined,
                genres: item.type_name ? [item.type_name] : undefined,
              };

              return (
                <div key={item.id} className="last:pr-4">
                  <MovieCard
                    item={contentItem}
                    onClick={() => onItemClick?.(item.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Handle carousel layout
  if (section.layout === "index_recommend_carousel") {
    const hasRightAction = section.right && "text" in section.right;

    return (
      <div className={className}>
        {/* Section Header */}
        <div className="mb-2 flex items-center justify-between px-4">
          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
          {hasRightAction && (
            <button
              onClick={() => onSeeAll?.(section)}
              className="text-primary-blue hover:text-primary-blue/80 flex items-center gap-1 text-sm"
            >
              {t("pages.home.sections.seeAll")}
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="scrollbar-hide overflow-x-auto px-4 py-2">
          <div className="flex gap-2.5">
            {section.list.map((item, index) => {
              // Transform to ContentItem format for MovieCard
              const contentItem: ContentItem = {
                id: `carousel-${index}-${item.title}`,
                title: item.title,
                imageUrl: item.image,
                type: "movie",
                badge: item.label
                  ? { type: "highly_recommended", label: item.label }
                  : undefined,
              };

              return (
                <div
                  key={`carousel-${index}-${item.title}`}
                  className="last:pr-4"
                >
                  <MovieCard
                    item={contentItem}
                    onClick={() => onItemClick?.(contentItem.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Handle advert layout (return null for now)
  if (section.layout === "advert_self") {
    return null;
  }

  return null;
}
