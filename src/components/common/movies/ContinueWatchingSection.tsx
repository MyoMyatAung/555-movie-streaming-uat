import type { ContentSection } from "@/types/movie";
import { ChevronRightIcon } from "lucide-react";
import { ContinueWatchingCard } from "./ContinueWatchingCard";

interface ContinueWatchingSectionProps {
  section: ContentSection;
  onSeeAll?: (sectionId: string) => void;
  onItemClick?: (itemId: string) => void;
  className?: string;
}

export function ContinueWatchingSection({
  section,
  onSeeAll,
  onItemClick,
  className,
}: ContinueWatchingSectionProps) {
  return (
    <div className={className}>
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between px-4">
        <h3 className="text-lg font-semibold text-white">{section.title}</h3>
        {section.showSeeAll && (
          <button
            onClick={() => onSeeAll?.(section.id)}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            See all
            <ChevronRightIcon className="size-4" />
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="scrollbar-hide overflow-x-auto px-4">
        <div className="flex gap-2.5 pb-4">
          {section.items.map((item) => (
            <div key={item.id} className="last:pr-4">
              <ContinueWatchingCard
                item={item}
                onClick={() => onItemClick?.(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
