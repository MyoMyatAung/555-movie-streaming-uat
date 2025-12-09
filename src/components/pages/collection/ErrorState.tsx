/**
 * Collection Error State Component
 *
 * Displays an error state when collection data fails to load.
 * Includes a retry button to attempt reloading the data.
 *
 * Features:
 * - Error icon
 * - Localized error message
 * - Retry button with optional loading state
 *
 * @example
 * ```tsx
 * if (error) {
 *   return (
 *     <ErrorState
 *       onRetry={() => refetch()}
 *       isRetrying={isRefetching}
 *     />
 *   );
 * }
 * ```
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

// =============================================================================
// Types
// =============================================================================

export interface ErrorStateProps {
  /** Custom title (overrides i18n default) */
  title?: string;
  /** Custom description (overrides i18n default) */
  description?: string;
  /** Retry handler */
  onRetry?: () => void;
  /** Whether retry is in progress */
  isRetrying?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * ErrorState
 *
 * Renders an error state with icon, message, and retry button.
 * Used when API calls fail or data cannot be loaded.
 */
export function ErrorState({
  title,
  description,
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  const { t } = useTranslation();

  const displayTitle = title ?? t("profile.collection.loadingError.title");
  const displayDescription =
    description ?? t("profile.collection.loadingError.description");

  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center px-6 text-center",
        className
      )}
    >
      {/* Error Icon */}
      <div className="mb-4 rounded-full bg-red-500/10 p-4">
        <AlertCircleIcon className="size-12 text-red-400" />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-medium text-white/70">{displayTitle}</h3>

      {/* Description */}
      <p className="mb-6 max-w-xs text-sm text-white/50">{displayDescription}</p>

      {/* Retry Button */}
      {onRetry && (
        <Button
          onClick={onRetry}
          disabled={isRetrying}
          variant="outline"
          className="gap-x-2 border-white/20 text-white hover:bg-white/10"
        >
          <RefreshCwIcon
            className={cn("size-4", isRetrying && "animate-spin")}
          />
          {isRetrying
            ? t("common.loading")
            : t("profile.collection.loadingError.retryButton")}
        </Button>
      )}
    </div>
  );
}

export default ErrorState;

