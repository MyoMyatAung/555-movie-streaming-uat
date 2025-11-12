import EmptyFolderIcon from "@/assets/svgs/icon-empty.svg?react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center px-6 text-center",
        className,
      )}
    >
      {/* Icon */}
      {icon && <div className="mb-4">{icon}</div>}

      {/* Default folder icon if no icon provided */}
      {!icon && (
        <div className="mb-2">
          <EmptyFolderIcon className="size-25" />
        </div>
      )}

      {/* Title */}
      <h3 className="mb-2 text-lg font-medium text-white/70">{title}</h3>

      {/* Description */}
      {description && <p className="text-sm text-white/50">{description}</p>}
    </div>
  );
}
