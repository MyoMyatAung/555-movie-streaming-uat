import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: {
    icon?: React.ReactNode;
    label?: string;
    onClick: () => void;
  };
  className?: string;
}

function PageHeader({
  title,
  onBack,
  rightAction,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("w-full px-4 py-4", className)}>
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="flex size-10 items-center justify-center rounded-full bg-white/10 p-0 hover:bg-white/20"
        >
          <ChevronLeft className="size-6 text-white" />
        </Button>

        {/* Title */}
        <h1 className="text-xl font-semibold text-white">{title}</h1>

        {/* Right Action Button */}
        {rightAction ? (
          <Button
            onClick={rightAction.onClick}
            variant="ghost"
            className="flex size-10 items-center justify-center rounded-full bg-white/10 p-0 hover:bg-white/20"
          >
            {rightAction.icon && (
              <span className="text-white">{rightAction.icon}</span>
            )}
            {rightAction.label && (
              <span className="text-base text-white">{rightAction.label}</span>
            )}
          </Button>
        ) : (
          <div className="size-10" /> // Spacer for alignment
        )}
      </div>
    </header>
  );
}

export default PageHeader;
