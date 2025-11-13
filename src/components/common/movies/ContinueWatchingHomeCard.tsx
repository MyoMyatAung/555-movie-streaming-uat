import { cn } from "@/lib/utils";
import type { ContentItem } from "@/types/movie";
import PlayCircleButton from "./PlayCircleButton";

interface ContinueWatchingCardProps {
  item: ContentItem;
  progress?: number;
  onClick?: () => void;
  className?: string;
}

// Badge label mapping
const badgeLabels: Record<string, string> = {
  exclusive: "独播",
};

export function ContinueWatchingHomeCard({
  item,
  progress = 0,
  onClick,
  className,
}: ContinueWatchingCardProps) {
  const hasProgress = progress !== undefined && progress > 0;

  return (
    <div
      className={cn(
        "group relative shrink-0 cursor-pointer transition-transform",
        "w-[280px]",
        className,
      )}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover"
        />

        <PlayCircleButton />

        {/* Exclusive Badge - shown at bottom left above progress bar */}
        {item.badge?.type === "exclusive" && (
          <div className="absolute bottom-4 left-2 z-10">
            <div className="mt-2 space-y-1">
              <h3 className="line-clamp-1 text-base font-semibold text-white">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {item.badge?.type === "exclusive" && (
                  <span className="bg-primary-blue rounded px-1.5 py-0.5 text-xs font-semibold text-white">
                    {badgeLabels.exclusive}
                  </span>
                )}
                {item.episodeInfo && (
                  <span className="truncate">{item.episodeInfo}</span>
                )}
                {item.duration && (
                  <span className="text-[#AAAAAA]">{item.duration}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {hasProgress && (
          <div className="absolute right-0 bottom-0 left-0 h-1 bg-gray-800/50">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content Info */}
    </div>
  );
}
