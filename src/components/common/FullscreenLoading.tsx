import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

interface FullScreenLoadingProps {
  isVisible: boolean;
  onClose?: () => void;
  message?: string;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  spinnerSize?: "sm" | "md" | "lg";
  spinnerColor?: "primary" | "white" | "gray";
  allowCloseOnOverlayClick?: boolean;
}

export default function FullScreenLoading({
  isVisible,
  onClose,
  message,
  showCloseButton = true,
  className,
  overlayClassName,
  contentClassName,
  spinnerSize = "md",
  spinnerColor = "primary",
  allowCloseOnOverlayClick = false,
}: FullScreenLoadingProps) {
  const { t } = useTranslation();
  // Prevent body scroll when loading is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (allowCloseOnOverlayClick && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSpinnerSize = () => {
    switch (spinnerSize) {
      case "sm":
        return "h-4 w-4";
      case "lg":
        return "h-6 w-6";
      default:
        return "h-5 w-5";
    }
  };

  const getSpinnerColor = () => {
    switch (spinnerColor) {
      case "white":
        return "border-white border-t-transparent";
      case "gray":
        return "border-gray-400 border-t-transparent";
      default:
        return "border-primary-yellow border-t-transparent";
    }
  };

  if (!isVisible) return null;

  const loadingContent = (
    <div
      className={cn(
        "fixed inset-0 z-[var(--z-loading-layer)] flex items-center justify-center bg-black/50",
        overlayClassName,
      )}
      onClick={handleOverlayClick}
    >
      {/* Loading Content */}
      <div
        className={cn(
          "relative mx-4 rounded-lg bg-white px-6 py-4 shadow-lg",
          className,
        )}
      >
        {/* Close Button */}
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            type="button"
            aria-label="Close loading"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}

        {/* Loading Content */}
        <div className={cn("flex items-center gap-3", contentClassName)}>
          {/* Spinner */}
          <div
            className={cn(
              "animate-spin rounded-full border-2",
              getSpinnerSize(),
              getSpinnerColor(),
            )}
          />

          {/* Message */}
          <span className="text-sm font-medium text-gray-900">
            {message || t("common.loading")}
          </span>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render directly to document.body
  return createPortal(loadingContent, document.body);
}
