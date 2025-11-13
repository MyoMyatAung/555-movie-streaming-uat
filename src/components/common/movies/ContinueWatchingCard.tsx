import { cn } from "@/lib/utils";
import type { ContentItem } from "@/types/movie";
import { PlayIcon } from "lucide-react";

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

export function ContinueWatchingCard({
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

        {/* Play Icon Overlay - Always visible on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100">
          <div className="flex size-14 items-center justify-center rounded-full bg-black/30 backdrop-blur-[1px]">
            <PlayIcon className="ml-1 size-7 text-white" />
          </div>
        </div>

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
