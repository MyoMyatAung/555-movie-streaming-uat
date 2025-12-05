import RssErrorIcon from "@/assets/svgs/icon-rss-error.svg?react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

/**
 * PlaybackError Component
 * 
 * Displays an error message when video playback encounters an error.
 * Provides options to refresh the player or switch to an alternative resource.
 * 
 * @example
 * ```tsx
 * <PlaybackError
 *   onRefresh={() => {
 *     // Handle refresh logic
 *     console.log("Refreshing player...");
 *   }}
 *   onSwitchResource={() => {
 *     // Handle resource switching logic
 *     console.log("Switching to alternative resource...");
 *   }}
 * />
 * ```
 */
interface PlaybackErrorProps {
  /** Optional callback when the refresh button is clicked */
  onRefresh?: () => void;
  /** Optional callback when the switch resource button is clicked */
  onSwitchResource?: () => void;
  /** Whether to show the switch resource button */
  showSwitchResource?: boolean;
}

export function PlaybackError({
  onRefresh,
  onSwitchResource,
  showSwitchResource = true,
}: PlaybackErrorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 p-6">
      {/* Icon */}
      <RssErrorIcon className="h-10 w-10 opacity-40" />

      {/* Error Text */}
      <div className="text-center">
        <p className="text-base text-white">
          {t("movie-detail.error.playbackError")}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="secondary"
            className="min-w-[140px] bg-[#FFFFFF14] text-white"
          >
            {t("movie-detail.error.refresh")}
          </Button>
        )}
        {showSwitchResource && onSwitchResource && (
          <Button
            onClick={onSwitchResource}
            variant="default"
            className="min-w-[140px]"
          >
            {t("movie-detail.error.switch")}
          </Button>
        )}
      </div>
    </div>
  );
}

