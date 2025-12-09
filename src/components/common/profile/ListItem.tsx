/**
 * ListItem Component
 * 
 * A reusable list item component for profile sections.
 * Displays an icon, label, optional value, and chevron indicator.
 * 
 * This component follows the Single Responsibility Principle by handling
 * only the rendering of a single list item. It's highly reusable and can
 * be used in any list context throughout the application.
 * 
 * @example
 * ```tsx
 * <ListItem
 *   icon={VideoIcon}
 *   label="Continue Watching"
 *   onClick={() => navigate('/continue-watching')}
 * />
 * ```
 */

import { ChevronRight } from "lucide-react";
import type { ListItemConfig } from "@/types/profile-ui";
import { Link } from "@tanstack/react-router";

interface ListItemProps extends ListItemConfig {
  /** Translation function for labels */
  t: (key: string) => string;
}

export const ListItem = ({ icon: Icon, label, value, to, onClick, t }: ListItemProps) => {
  /**
   * Content of the list item (icon, label, value, chevron)
   */
  const content = (
    <>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-2xl">
          <Icon className="size-6 text-white" />
        </div>
        <span className="text-base font-medium">{t(label)}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-white/70">{value}</span>}
        <ChevronRight className="size-5 text-white" />
      </div>
    </>
  );

  /**
   * If 'to' prop is provided, wrap content in Link
   * Otherwise, render as a button with onClick handler
   */
  if (to) {
    return (
      <Link
        to={to}
        className="flex w-full items-center justify-between text-left transition-opacity hover:opacity-80"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between text-left transition-opacity hover:opacity-80"
    >
      {content}
    </button>
  );
};

