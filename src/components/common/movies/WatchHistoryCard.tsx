import PlayIcon from "@/assets/svgs/icon-play.svg?react";
import { Button } from "@/components/ui/button";
import type { WatchList } from "@/lib/db";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/types/movie";
import { CheckIcon } from "lucide-react";

interface WatchHistoryCardProps {
  item: ContentItem;
  watchListItem?: WatchList;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onSelect?: (itemId: string) => void;
  onPlay?: (itemId: string) => void;
  className?: string;
}

export function WatchHistoryCard({
  item,
  watchListItem,
  isSelected = false,
  isSelectionMode = false,
  onSelect,
  onPlay,
  className,
}: WatchHistoryCardProps) {
  const handleCardClick = () => {
    if (isSelectionMode) {
      onSelect?.(item.id);
    } else {
      onPlay?.(item.id);
    }
  };

  const getProgressPercentage = () => {
    if (!watchListItem) return 0;

    const totalVideoTime = watchListItem.duration ?? 0;
    const currentVideoTime = watchListItem.play_head_in_sec ?? 0;

    return totalVideoTime > 0
      ? Number(((currentVideoTime / totalVideoTime) * 100).toFixed(2))
      : 0;
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn("flex items-center gap-3", className)}
    >
      {/* Thumbnail */}
      <div className="relative h-[80px] w-[120px] shrink-0 overflow-hidden rounded-lg">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover"
        />

        {/* HD/4K Badge */}
        {item.badge?.type === "exclusive" && (
          <div className="bg-primary-blue absolute top-0 right-0 rounded-bl-sm px-1.5 py-0.5 text-xs text-white">
            HD
          </div>
        )}

        {/* Progress Bar */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
          <div
            className="bg-primary-blue h-full"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Content Info */}
      <div className="flex flex-1 flex-col justify-center gap-1">
        <h3 className="text-base font-medium text-neutral-50">{item.title}</h3>
        <p className="text-sm text-neutral-50">
          {item.type === "tv_series" || item.type === "animation"
            ? `Action | 2025 | ${item.episodes || "S1 Ep3"}`
            : `Action | 2025 | ${item.duration || "2hr 16mins"}`}
        </p>
        <p className="text-sm text-neutral-50">
          Watched {getProgressPercentage()}% of this{" "}
          {item.type === "tv_series" || item.type === "animation"
            ? "episode"
            : "movie"}
        </p>
      </div>

      {/* Selection Checkbox/Icon */}
      {isSelectionMode ? (
        <div className="flex items-center">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(item.id);
            }}
            className={cn(
              "flex size-6 items-center justify-center rounded-full border-2 transition-all",
              isSelected
                ? "border-primary-blue bg-primary-blue"
                : "border-white/30 bg-white/10",
            )}
          >
            {isSelected && <CheckIcon className="size-4 text-white" />}
          </div>
        </div>
      ) : (
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex size-9.5 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
        >
          <PlayIcon className="size-5 text-white" />
        </Button>
      )}
    </div>
  );
}
