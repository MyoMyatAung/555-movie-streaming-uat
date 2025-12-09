/**
 * QuickActionButton Component
 * 
 * A reusable button component for quick actions in the profile page.
 * Features an icon with gradient background and label.
 * Includes hover animation effect.
 * 
 * This component is designed with the Single Responsibility Principle,
 * handling only the rendering and interaction of a single quick action button.
 * 
 * @example
 * ```tsx
 * <QuickActionButton
 *   icon={IconNotification}
 *   label="Notifications"
 *   gradient="bg-[linear-gradient(...)]"
 *   onClick={handleNotificationClick}
 * />
 * ```
 */

import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { QuickAction } from "@/types/profile-ui";

interface QuickActionButtonProps extends QuickAction {
  /** Translation function for labels */
  t: (key: string) => string;
}

export const QuickActionButton = ({
  icon: Icon,
  label,
  gradient,
  to,
  onClick,
  t,
}: QuickActionButtonProps) => {
  /**
   * Content of the quick action button (icon and label)
   */
  const content = (
    <>
      <div
        className={cn(
          "flex size-14 items-center justify-center rounded-2xl bg-linear-to-br shadow-[0_12px_32px_rgba(10,16,32,0.45)] transition-transform duration-200 group-hover:-translate-y-1",
          gradient
        )}
      >
        <Icon
          className={cn(
            "size-8 text-white",
            // Special case for settings icon (smaller size)
            label.includes("settings") && "size-6"
          )}
        />
      </div>
      <span className="text-xs font-medium text-white/80">{t(label)}</span>
    </>
  );

  /**
   * If 'to' prop is provided, wrap content in Link
   * Otherwise, render as a button with onClick handler
   */
  if (to) {
    return (
      <Link to={to} className="group flex flex-col items-center gap-2">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-2">
      {content}
    </button>
  );
};

