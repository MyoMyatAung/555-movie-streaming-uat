import { Button } from "@/components/ui/button";
import type { WatchList } from "@/lib/db";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/types/movie";
import { CheckIcon, PlayIcon } from "lucide-react";

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
      className={cn(
        "flex gap-3",
        isSelected && "bg-white/15 ring-2 ring-blue-500",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-[80px] w-[120px] flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover"
        />

        {/* HD/4K Badge */}
        {item.badge?.type === "exclusive" && (
          <div className="absolute top-0 right-0 rounded-bl-sm bg-blue-500 px-1.5 py-0.5 text-xs text-white">
            HD
          </div>
        )}

        {/* Play Icon (only show when not in selection mode) */}
        {!isSelectionMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.(item.id);
              }}
              className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <PlayIcon className="size-6 fill-white text-white" />
            </Button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
          <div
            className="h-full bg-blue-500"
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
      {isSelectionMode && (
        <div className="flex items-center">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(item.id);
            }}
            className={cn(
              "flex size-6 items-center justify-center rounded-full border-2 transition-all",
              isSelected
                ? "border-blue-500 bg-blue-500"
                : "border-white/30 bg-transparent",
            )}
          >
            {isSelected && <CheckIcon className="size-4 text-white" />}
          </div>
        </div>
      )}
    </div>
  );
}
