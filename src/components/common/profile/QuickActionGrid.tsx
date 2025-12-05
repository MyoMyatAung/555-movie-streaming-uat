/**
 * QuickActionGrid Component
 * 
 * A grid layout component that displays quick action buttons.
 * Uses a responsive 4-column grid layout.
 * 
 * This component demonstrates the Dependency Inversion Principle by depending
 * on the abstraction (QuickAction interface) rather than concrete implementations.
 * 
 * @example
 * ```tsx
 * <QuickActionGrid
 *   actions={quickActions}
 *   className="mt-8"
 * />
 * ```
 */

import { useTranslation } from "react-i18next";
import { QuickActionButton } from "./QuickActionButton";
import type { QuickActionGridProps } from "@/types/profile-ui";
import { cn } from "@/lib/utils";

export const QuickActionGrid = ({ actions, className }: QuickActionGridProps) => {
  const { t } = useTranslation();

  return (
    <div className={cn("grid grid-cols-4 gap-4", className)}>
      {actions.map((action, index) => (
        <QuickActionButton key={`${action.label}-${index}`} {...action} t={t} />
      ))}
    </div>
  );
};

