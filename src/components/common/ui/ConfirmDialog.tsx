import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2"
          >
            <div
              className={cn(
                "rounded-2xl bg-[#2A2A2E] p-6 shadow-xl",
                className,
              )}
            >
              {/* Title */}
              <h2 className="mb-3 text-xl font-bold text-white">{title}</h2>

              {/* Message */}
              <p className="mb-6 text-base leading-relaxed text-white/70">
                {message}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={onCancel}
                  className="flex-1 rounded-xl bg-white/10 py-3 text-base font-medium text-white hover:bg-white/20"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  className="flex-1 rounded-xl bg-blue-500 py-3 text-base font-semibold text-white hover:bg-blue-600"
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

