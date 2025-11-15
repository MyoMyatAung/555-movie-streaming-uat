import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Yes, Remove",
  cancelText = "Go back",
  onConfirm,
  onCancel,
  className,
  confirmButtonClassName,
  cancelButtonClassName,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-70 bg-black/70"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
            className="fixed inset-x-6 top-1/2 z-70 mx-auto max-w-sm -translate-y-1/2"
          >
            <div
              className={cn(
                "bg-dark-gray rounded-2xl p-6 shadow-2xl backdrop-blur-xl",
                className,
              )}
            >
              {title && (
                <h2 className="mb-4 text-lg font-bold text-neutral-50">
                  {title}
                </h2>
              )}

              <p className="mb-8 text-base leading-relaxed text-neutral-50">
                {message}
              </p>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  className={cn(
                    "text-base text-neutral-400 hover:bg-transparent hover:text-neutral-50",
                    cancelButtonClassName,
                  )}
                >
                  {cancelText}
                </Button>
                <Button
                  variant="ghost"
                  onClick={onConfirm}
                  className={cn(
                    "text-primary-blue hover:text-primary-blue/90 text-base hover:bg-transparent",
                    confirmButtonClassName,
                  )}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
