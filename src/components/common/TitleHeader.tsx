import { ChevronLeftIcon } from "lucide-react";
import { Button } from "../ui/button";

export function TitleHeader({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative mb-4 flex items-center justify-between text-center">
      <div>
        {onClose && (
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={onClose}
            className="rounded-full border border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <ChevronLeftIcon className="size-6" />
          </Button>
        )}
      </div>

      {title && (
        <h1 className="flex-1 text-center text-[20px] font-medium text-white">
          {title}
        </h1>
      )}

      <div>{children}</div>
    </div>
  );
}
