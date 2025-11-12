import { Skeleton } from "@/components/ui/skeleton";
import type { WatchList } from "@/lib/db";
import type { ContentItem } from "@/types/movie";
import { ChevronRightIcon } from "lucide-react";
import { ContinueWatchingCard } from "./ContinueWatchingCard";

interface ContinueWatchingSectionProps {
  title?: string;
  watchListFromIndexDB?: WatchList[];
  watchListVideos?: ContentItem[];
  isLoading?: boolean;
  onSeeAll?: () => void;
  onItemClick?: (videoId: string) => void;
  className?: string;
}

const ContinueWatchingSectionSkeleton = () => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between px-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="scrollbar-hide overflow-x-auto px-4">
        <div className="flex gap-2.5 pb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <Skeleton className="h-[157px] w-[280px] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function ContinueWatchingSection({
  title = "Continue Watching",
  watchListFromIndexDB = [],
  watchListVideos = [],
  isLoading = false,
  onSeeAll,
  onItemClick,
  className,
}: ContinueWatchingSectionProps) {
  if (isLoading) {
    return <ContinueWatchingSectionSkeleton />;
  }

  if (watchListVideos.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between px-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
        >
          See all
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="scrollbar-hide overflow-x-auto px-4">
        <div className="flex gap-2.5 pb-4">
          {watchListVideos.map((item) => {
            const currentVideo = watchListFromIndexDB.find(
              (watchList) => watchList.vod_id === item.id,
            );
            const totalVideoTime = currentVideo?.duration ?? 0;
            const currentVideoTime = currentVideo?.play_head_in_sec ?? 0;
            const progress =
              totalVideoTime > 0
                ? Number(((currentVideoTime / totalVideoTime) * 100).toFixed(2))
                : 20; // Default 20% for mock data

            return (
              <div
                key={`${item.id}-${currentVideo?.ep_id || ""}`}
                className="last:pr-4"
              >
                <ContinueWatchingCard
                  item={item}
                  progress={progress}
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

export { ContinueWatchingSectionSkeleton };
