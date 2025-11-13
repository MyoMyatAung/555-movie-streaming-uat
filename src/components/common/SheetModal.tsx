import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Sheet } from "react-modal-sheet";
import { Button } from "../ui/button";

const defaultSnapPoints = [0, 0.8, 1];

function SheetModal({
  detent = "default",
  children,
  showModal,
  setShowModal,
  snapPoints = defaultSnapPoints,
  disableDrag = false,
  disableBackdropClick = false,
  containerClassName,
  title,
  onClose,
}: {
  detent?: "default" | "content" | "full";
  children: React.ReactNode;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  snapPoints?: Array<number>;
  disableDrag?: boolean;
  disableBackdropClick?: boolean;
  containerClassName?: string;
  title?: string;
  onClose?: () => void;
}) {
  // Ensure snap points satisfy validation requirements
  const validatedSnapPoints = (() => {
    if (disableDrag) return [0, 1];

    const points = [...snapPoints];
    if (points[0] !== 0) points.unshift(0);
    if (points[points.length - 1] !== 1) points.push(1);
    return points;
  })();

  // Find the initial snap index for the desired position
  const getInitialSnap = () => {
    if (disableDrag) return 1;

    // Find the index of the first non-zero snap point
    const firstNonZeroIndex = validatedSnapPoints.findIndex(
      (point) => point > 0,
    );
    return firstNonZeroIndex !== -1 ? firstNonZeroIndex : 1;
  };

  return (
    <Sheet
      detent={disableDrag ? "content" : detent}
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      initialSnap={getInitialSnap()}
      snapPoints={validatedSnapPoints}
      onSnap={(snapIndex) => {
        // Close modal if snapped to 0 (fully closed)
        if (snapIndex === 0) {
          setShowModal(false);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{ zIndex: 60 }}
    >
      <Sheet.Container
        className={cn("mx-auto max-w-md rounded-t-3xl!", containerClassName)}
        style={{ zIndex: 60 }}
      >
        <Sheet.Header />
        {title && (
          <div className="relative mb-4 px-4 text-center">
            <div></div>
            {title && (
              <h1 className="text-[20px] font-medium text-white">{title}</h1>
            )}
            {onClose && (
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={onClose}
                className="absolute -top-1 right-5 text-white"
              >
                <XIcon className="size-6" />
              </Button>
            )}
          </div>
        )}
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        className={cn(disableBackdropClick && "pointer-events-none!")}
        style={{ zIndex: 40 }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!disableBackdropClick) {
            setShowModal(false);
          }
        }}
      />
    </Sheet>
  );
}

export default SheetModal;
