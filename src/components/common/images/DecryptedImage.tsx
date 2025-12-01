import { cn } from "@/lib/utils";
import { decryptImage } from "@/utils/imageDecrypt";
import { useEffect, useRef, useState } from "react";

export interface DecryptedImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  loading?: "lazy" | "eager";
  rootMargin?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * DecryptedImage - A performant component for displaying encrypted images
 *
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Automatic image decryption
 * - Loading states
 * - Memory cleanup for blob URLs
 * - Configurable object-fit and styling
 */
export function DecryptedImage({
  src,
  alt,
  width,
  height,
  className = "",
  objectFit = "cover",
  loading = "lazy",
  rootMargin = "100px",
  fallback,
  onLoad,
  onError,
  ...props
}: DecryptedImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [decryptedSrc, setDecryptedSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    // For eager loading, decrypt immediately
    if (loading === "eager") {
      setIsLoading(true);
      decryptImage(src)
        .then((url) => {
          setDecryptedSrc(url);
          setIsLoading(false);
          setHasError(false);
        })
        .catch(() => {
          setIsLoading(false);
          setHasError(true);
          onError?.();
        });
      return;
    }

    // For lazy loading, use IntersectionObserver
    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            try {
              setIsLoading(true);
              const decryptedUrl = await decryptImage(src);
              console.log("decryptedUrl", decryptedUrl);
              setDecryptedSrc(decryptedUrl);
              setIsLoading(false);
              setHasError(false);
            } catch (error) {
              console.error("Error decrypting image:", error);
              setIsLoading(false);
              setHasError(true);
              onError?.();
            }
            observer.disconnect();
          }
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, loading, rootMargin, onError]);

  // Clean up blob URLs on unmount or when src changes
  useEffect(() => {
    return () => {
      if (decryptedSrc && decryptedSrc.startsWith("blob:")) {
        URL.revokeObjectURL(decryptedSrc);
      }
    };
  }, [decryptedSrc]);

  const containerStyles = {
    width: width || "100%",
    height: height || "100%",
  };

  const imageOpacity = decryptedSrc && !isLoading && !hasError ? "1" : "0";

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full bg-gray-200", className)}
      style={containerStyles}
    >
      {/* Decrypted Image */}
      {decryptedSrc && !hasError && (
        <img
          src={decryptedSrc}
          alt={alt}
          className={cn(
            "h-full w-full",
            `object-${objectFit}`,
            "transition-opacity duration-300 ease-in-out",
          )}
          style={{
            opacity: imageOpacity,
          }}
          onLoad={onLoad}
          onError={() => {
            setHasError(true);
            onError?.();
          }}
          {...props}
        />
      )}

      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-20 flex animate-pulse items-center justify-center bg-gray-200">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        </div>
      )}

      {/* Error State / Fallback */}
      {(hasError || (!decryptedSrc && !isLoading)) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-200">
          {fallback || (
            <div className="text-sm text-gray-400">Failed to load image</div>
          )}
        </div>
      )}
    </div>
  );
}
