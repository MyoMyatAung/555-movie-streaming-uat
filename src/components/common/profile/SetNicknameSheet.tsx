import { useUpdateNickname } from "@/apis/profile";
import { Form } from "@/components/common/form/Form";
import SheetModal from "@/components/common/SheetModal";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod";
import { FullScreenLoading } from "../FullscreenLoading";

interface SetNicknameSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname?: string;
}

const MAX_NICKNAME_LENGTH = 20;

const createSchema = (t: any) =>
  z.object({
    nickname: z
      .string()
      .min(1, t("profile.edit.nicknameRequired") || "Nickname is required")
      .max(
        MAX_NICKNAME_LENGTH,
        t("profile.edit.nicknameMaxLength") ||
          `Nickname must be at most ${MAX_NICKNAME_LENGTH} characters`,
      ),
  });

export function SetNicknameSheet({
  isOpen,
  onClose,
  currentNickname = "",
}: SetNicknameSheetProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  const schema = createSchema(t);
  type FormData = z.infer<typeof schema>;

  const formMethods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nickname: currentNickname,
    },
  });

  // Reset form when modal opens/closes or currentNickname changes
  useEffect(() => {
    if (isOpen) {
      formMethods.reset({
        nickname: currentNickname,
      });
    }
  }, [isOpen, currentNickname, formMethods]);

  const { mutateAsync: updateNickname, isPending } = useUpdateNickname({
    onSuccess: (response) => {
      if (response?.status) {
        const nickname = formMethods.getValues("nickname");
        updateUser({ nickname });
        toast.success(
          t("profile.edit.nicknameUpdatedSuccessfully") ||
            "Nickname updated successfully",
        );
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        onClose();
      } else {
        toast.error(
          response?.message ||
            t("profile.edit.failedToUpdateNickname") ||
            "Failed to update nickname",
        );
      }
    },
    onError: (error) => {
      console.error("Error updating nickname:", error);
      toast.error(
        error?.message ||
          t("profile.edit.failedToUpdateNickname") ||
          "Failed to update nickname",
      );
    },
  });

  const handleSubmit = async (data: FormData) => {
    // If nickname hasn't changed, just close
    if (data.nickname.trim() === currentNickname) {
      onClose();
      return;
    }

    try {
      await updateNickname({ nickname: data.nickname.trim() });
    } catch (error) {
      // Error is handled in the mutation's onError callback
      console.error("Failed to update nickname:", error);
    }
  };

  if (isPending) {
    return <FullScreenLoading isVisible={isPending} />;
  }

  return (
    <SheetModal
      detent="content"
      showModal={isOpen}
      setShowModal={onClose}
      title={t("profile.edit.setNickname") || "Set Nickname"}
      onClose={onClose}
      containerClassName="!bg-dark-gray"
    >
      <div className="h-[280px] px-4 pt-4 pb-6">
        <Form
          id="set-nickname-form"
          formMethods={formMethods}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {/* Input Field */}
            <div>
              <Form.InputField
                name="nickname"
                label={t("profile.edit.nickname")}
                variant="border"
                className="focus:border-primary-blue rounded-lg border-white/20 bg-white/5 text-white placeholder:text-white/50"
                maxLength={MAX_NICKNAME_LENGTH}
              />
              {/* Character Limit Text */}
              <p className="mt-2 text-xs text-white/60">
                {t("profile.edit.noMoreThanCharacters", {
                  count: MAX_NICKNAME_LENGTH,
                }) || `No more than ${MAX_NICKNAME_LENGTH} characters`}
              </p>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="glassmorphism-primary-blue hover:bg-primary-blue/90 my-2 h-10 w-full rounded-lg px-4 py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? t("common.loading") || "Saving..."
                : t("profile.edit.save") || "Save"}
            </Button>
          </div>
        </Form>
      </div>
    </SheetModal>
  );
}
