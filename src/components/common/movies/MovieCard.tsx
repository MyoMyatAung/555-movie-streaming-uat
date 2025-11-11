import { cn } from "@/lib/utils";
import type { ContentItem } from "@/types/movie";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { MovieDetailCard } from "./MovieDetailCard";

interface MovieCardProps {
  item: ContentItem;
  onClick?: () => void;
  className?: string;
}

// Badge label mapping
const badgeLabels: Record<string, string> = {
  exclusive: "独播",
  most_watched: "最多人看",
  highly_recommended: "高分推荐",
  best_of_month: "本月最佳",
};

export function MovieCard({ item, onClick, className }: MovieCardProps) {
  const isTopRank = item.badge?.type === "top_rank";
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPressedRef = useRef(false);

  const handlePressStart = () => {
    isPressedRef.current = true;
    pressTimerRef.current = setTimeout(() => {
      if (isPressedRef.current) {
        setIsFlipped(!isFlipped);
        onClick?.();
      }
    }, 500); // 0.5 second press duration
  };

  const handlePressEnd = () => {
    isPressedRef.current = false;
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handlePlay = () => {
    console.log("Play:", item.title);
    // Handle play action
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className={cn(
        "group relative flex-shrink-0 cursor-pointer",
        "w-[140px]",
        className,
      )}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
      >
        {/* Front Side - Movie Poster */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Image Container */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />

            {/* Top Rank Badge - Large number at bottom left with gradient */}
            {isTopRank && item.badge?.rank && (
              <>
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-black/50 blur-[20px]" />
                <div className="absolute inset-x-0 bottom-0 h-24 w-full bg-white/40 blur-[20px]">
                  <svg width="100" height="100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="#FFFFFF4D"
                      style={{ filter: "blur(20px)" }}
                    />
                  </svg>
                  <svg width="100" height="100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="#FFFFFF4D"
                      style={{ filter: "blur(50px)" }}
                    />
                  </svg>
                </div>
                <div className="absolute bottom-2 left-2 z-10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      {item.badge.rank}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      Top rank
                    </span>
                  </div>
                  <div className="max-w-[110px] truncate text-sm text-neutral-50">
                    {item.title}
                  </div>
                  <div className="mt-0.5 text-xs text-neutral-50">
                    Episodes {item.episodes}
                  </div>
                </div>
              </>
            )}

            {/* Rating Badge - top left corner with blue background */}
            {item.rating && !isTopRank && (
              <div className="absolute top-0 right-0 z-10 rounded-bl-sm bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                {item.rating}
              </div>
            )}

            {/* Other Badges - top right corner */}
            {item.badge &&
              !isTopRank &&
              item.badge.type !== "exclusive" &&
              badgeLabels[item.badge.type] && (
                <div className="absolute top-0 right-0 z-10 rounded-bl-sm bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {badgeLabels[item.badge.type]}
                </div>
              )}

            {/* Exclusive Badge - top right corner */}
            {item.badge?.type === "exclusive" && !isTopRank && (
              <div className="absolute top-0 right-0 z-10 rounded-bl-sm bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                {badgeLabels.exclusive}
              </div>
            )}
          </div>

          {/* Content Info */}
          <div className="mt-2 space-y-1">
            <h3 className="line-clamp-1 text-sm font-medium text-white">
              {item.title}
            </h3>
            <div className="text-xs text-gray-400">
              {isTopRank && item.episodes && (
                <span>Episodes {item.episodes}</span>
              )}
              {!isTopRank && item.duration && <span>{item.duration}</span>}
            </div>
          </div>
        </div>

        {/* Back Side - Movie Details */}
        <div
          className="absolute inset-0 top-0 left-0"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <MovieDetailCard
            item={item}
            onPlay={handlePlay}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorite={isFavorite}
            className="aspect-[2/3]"
          />
        </div>
      </motion.div>
    </div>
  );
}
