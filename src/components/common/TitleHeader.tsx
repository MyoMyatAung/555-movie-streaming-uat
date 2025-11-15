import { ChevronLeftIcon } from "lucide-react";
import { Button } from "../ui/button";

export function TitleHeader({
  title,
  onClose,
}: {
  title: string;
  onClose?: () => void;
}) {
  return (
    <div className="relative mb-4 text-center">
      <div></div>

      {title && <h1 className="text-[20px] font-medium text-white">{title}</h1>}

      {onClose && (
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={onClose}
          className="absolute -top-1 left-0 rounded-full border border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          <ChevronLeftIcon className="size-6" />
        </Button>
      )}
    </div>
  );
}
