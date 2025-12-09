/**
 * ListSection Component
 * 
 * A reusable section component that displays a list of items in a glassmorphism card.
 * This component follows the Open/Closed Principle - it's open for extension
 * (can accept any list items) but closed for modification.
 * 
 * @example
 * ```tsx
 * <ListSection
 *   items={watchlistLinks}
 *   className="mt-4"
 * />
 * ```
 */

import { useTranslation } from "react-i18next";
import { ListItem } from "./ListItem";
import type { ListSectionProps } from "@/types/profile-ui";
import { cn } from "@/lib/utils";

export const ListSection = ({ items, className }: ListSectionProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "glassmorphism-light rounded-xl p-4 shadow-[0_25px_50px_rgba(5,10,25,0.45)] backdrop-blur-xl",
        className
      )}
    >
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`}>
            <ListItem {...item} t={t} />
          </div>
        ))}
      </div>
    </div>
  );
};

