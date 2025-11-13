import PlayIcon from "@/assets/svgs/icon-play.svg?react";
import { Button } from "@/components/ui/button";
import type { HeroBannerItem } from "@/types/movie";
import type { PanInfo } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DividerStroke from "./DividerStroke";

interface HeroBannerProps {
  items: HeroBannerItem[];
  onWatchNow?: (item: HeroBannerItem) => void;
  className?: string;
  autoPlayInterval?: number; // in milliseconds, default 5000
}

export function HeroBanner({
  items,
  onWatchNow,
  className,
  autoPlayInterval = 5000,
}: HeroBannerProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = items[currentIndex];

  // Auto-play functionality
  useEffect(() => {
    if (items.length <= 1 || !autoPlayInterval) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [items.length, autoPlayInterval]);

  if (!currentItem) return null;

  const handleWatchNow = () => {
    onWatchNow?.(currentItem);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset > threshold || velocity > 500) {
      // Swipe right - go to previous
      setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    } else if (offset < -threshold || velocity < -500) {
      // Swipe left - go to next
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className={className}>
      <div className="relative h-[220px] w-full overflow-hidden rounded-xl md:h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <img
              src={currentItem.imageUrl}
              alt={currentItem.title}
              className="h-full w-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-auto"
          >
            {/* Title */}
            <h2
              className="text-3xl font-bold text-white md:text-4xl"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              {currentItem.title}
            </h2>

            {/* Genres and Duration */}
            <div
              className="flex flex-wrap items-center gap-3"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {currentItem.genres.map((genre, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-white">{genre}</span>
                  {idx < currentItem.genres.length - 1 && (
                    <DividerStroke height="20" />
                  )}
                </div>
              ))}
              <DividerStroke height="20" />
              <span className="text-sm text-white/80">
                {currentItem.duration}
              </span>
            </div>

            {/* Watch Now Button */}
            <Button
              onClick={handleWatchNow}
              size="lg"
              style={{ fontFamily: "Outfit, sans-serif" }}
              className="mt-2 w-fit rounded-full bg-white/20 text-base font-semibold text-white hover:bg-white/30"
            >
              <PlayIcon className="size-5" />
              {t("pages.home.heroBanner.watchNow")}
            </Button>
          </motion.div>
        </div>

        {/* Carousel Indicators - Dots */}
        {items.length > 1 && (
          <div className="absolute right-6 bottom-6 flex gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`size-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary-blue"
                    : "bg-white/40 hover:bg-white/60"
                } `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
