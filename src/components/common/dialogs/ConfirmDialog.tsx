import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Yes, Remove",
  cancelText = "Go back",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#1F1F1F] p-6 shadow-xl">
        <h2 className="mb-3 text-xl font-bold text-white">{title}</h2>
        <p className="mb-6 text-base leading-relaxed text-white/70">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            className="flex-1 rounded-full bg-white/10 py-6 text-base font-semibold text-white hover:bg-white/20"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-blue-500 py-6 text-base font-semibold text-white hover:bg-blue-600"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

