import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/types/movie";
import { HeartIcon, PlayIcon, StarIcon } from "lucide-react";
import DividerStroke from "./DividerStroke";

interface MovieDetailCardProps {
  item: ContentItem;
  onPlay?: () => void;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  className?: string;
}

export function MovieDetailCard({
  item,
  onPlay,
  onFavoriteToggle,
  isFavorite = false,
  className,
}: MovieDetailCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-lg shadow-[0px_0px_8px_0px_rgba(36,150,255,0.2)]",
        className,
      )}
    >
      {/* Background with blur effect */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full scale-110 object-cover blur-[8px]"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col px-1.5 py-2.5">
        {/* Title */}
        <h3 className="mb-2 text-lg leading-tight font-bold text-white">
          {item.title}
        </h3>

        {/* Rating and Duration */}
        <div className="mb-0.5 flex items-center gap-2 text-sm text-white/90">
          <div className="flex items-center gap-1">
            <StarIcon className="size-3.5 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold">{item.rating || "6.8"}</span>
          </div>
          <DividerStroke />
          <span>{item.duration || "2hr 48mins"}</span>
        </div>

        {/* Genres */}
        <div className="mb-1.5 flex flex-wrap gap-2 text-sm text-white/80">
          {item.genres?.map((genre, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span>{genre}</span>
              {idx < (item.genres?.length || 0) - 1 && <DividerStroke />}
            </div>
          )) || (
            <>
              <span>Horror</span>
              <DividerStroke />
              <span>Fantasy</span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-6 flex-1 text-xs leading-relaxed text-white/70">
          {item.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Favorite Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.();
            }}
            className={cn(
              "flex size-7.5 items-center justify-center rounded-full transition-colors",
              isFavorite
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-white/20 hover:bg-white/30",
            )}
          >
            <HeartIcon
              className={cn(
                "size-4",
                isFavorite ? "fill-white text-white" : "text-white",
              )}
            />
          </Button>

          {/* Play Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
            className="!h-7.5 flex-1 gap-2 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <PlayIcon className="size-4" />
            Play
          </Button>
        </div>
      </div>
    </div>
  );
}
