import { useChangePassword } from "@/apis/profile";
import { Form } from "@/components/common/form/Form";
import SheetModal from "@/components/common/SheetModal";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod";
import { FullScreenLoading } from "../FullscreenLoading";

interface ChangePasswordSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordSheet({
  isOpen,
  onClose,
}: ChangePasswordSheetProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { recaptchaToken, setRecaptchaToken } = useAuthStore();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const schema = z
    .object({
      old_password: z
        .string()
        .min(
          1,
          t("profile.settings.currentPasswordRequired") ||
            "Current password is required",
        ),
      new_password: z
        .string()
        .min(8, t("profile.settings.passwordRequirements"))
        .max(25, t("profile.settings.passwordRequirements"))
        .refine((value) => {
          const hasLetter = /[A-Za-z]/.test(value);
          const hasNumber = /\d/.test(value);
          return Number(hasLetter) + Number(hasNumber) >= 2;
        }, t("profile.settings.passwordRequirements")),
      confirm_new_password: z
        .string()
        .min(8, t("profile.settings.passwordRequirements")),
    })
    .refine((data) => data.new_password === data.confirm_new_password, {
      message: t("profile.settings.passwordsNotMatch"),
      path: ["confirm_new_password"],
    });
  type FormData = z.infer<typeof schema>;

  const formMethods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      formMethods.reset({
        old_password: "",
        new_password: "",
        confirm_new_password: "",
      });
      setHasSubmitted(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  }, [isOpen, formMethods, setRecaptchaToken]);

  const { mutateAsync: changePassword, isPending: isChangePasswordPending } =
    useChangePassword({
      onSuccess: (response) => {
        if (response?.status) {
          toast.success(
            t("profile.settings.passwordUpdatedSuccessfully") ||
              "Password updated successfully",
          );
          queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
          onClose();
        } else {
          toast.error(
            response?.message ||
              t("profile.settings.failedToUpdatePassword") ||
              "Failed to update password",
          );
        }
      },
      onError: (error) => {
        console.error("Error changing password:", error);
        const errorMessage =
          error?.response?.data?.error?.detail ||
          error?.message ||
          t("profile.settings.failedToUpdatePassword") ||
          "Failed to update password";
        toast.error(errorMessage);
      },
    });

  const handleSubmit = async (data: FormData) => {
    if (!recaptchaToken) {
      toast.error(t("auth.signUp.pleaseCompleteRecaptcha"));
      setHasSubmitted(true);
      return;
    }

    setHasSubmitted(true);

    try {
      await changePassword({
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_new_password: data.confirm_new_password,
      });
    } catch (error) {
      // Error is handled in the mutation's onError callback
      console.error("Failed to change password:", error);
    }
  };

  const onError = () => {
    setHasSubmitted(true);
  };

  const onChange = (value: string | null) => {
    setRecaptchaToken(value);
  };

  if (isChangePasswordPending) {
    return <FullScreenLoading isVisible={isChangePasswordPending} />;
  }

  return (
    <SheetModal
      detent="content"
      showModal={isOpen}
      setShowModal={onClose}
      title={t("profile.settings.changePassword") || "Change Password"}
      onClose={onClose}
      containerClassName="!bg-dark-gray"
    >
      <div className="h-[650px] px-4 pt-4 pb-6">
        <Form
          id="change-password-form"
          formMethods={formMethods}
          onSubmit={handleSubmit}
          onError={onError}
          className="flex w-full flex-col items-center space-y-5"
        >
          {/* Old Password Field */}
          <Form.PasswordField
            name="old_password"
            label={t("profile.settings.currentPassword") || "Old Password"}
            variant="border"
            placeholder={
              t("profile.settings.currentPasswordPlaceholder") ||
              "Enter current password"
            }
          />

          {/* New Password Field */}
          <Form.PasswordField
            name="new_password"
            label={t("profile.settings.newPassword") || "New Password"}
            variant="border"
            placeholder={
              t("profile.settings.newPasswordPlaceholder") ||
              "Enter new password"
            }
          />

          {/* Confirm New Password Field */}
          <Form.PasswordField
            name="confirm_new_password"
            label={
              t("profile.settings.retypeNewPassword") || "Confirm New Password"
            }
            variant="border"
            placeholder={
              t("profile.settings.retypeNewPasswordPlaceholder") ||
              "Retype new password"
            }
          />

          {/* Password Requirements */}
          {!formMethods.formState.errors.new_password && (
            <p className="w-full text-xs text-white/60">
              {t("profile.settings.passwordRequirements") ||
                "8-25 characters. Must be a combination of at least two of the following: letters, numbers."}
            </p>
          )}

          {/* reCAPTCHA */}
          <div className="text-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              onChange={onChange}
              onExpired={() => setRecaptchaToken(null)}
              onErrored={() => setRecaptchaToken(null)}
              className="mx-auto"
            />
            {hasSubmitted && !recaptchaToken && (
              <p className="mt-1 text-xs text-red-400">
                {t("auth.signUp.pleaseCompleteRecaptcha") ||
                  "Please complete the reCAPTCHA"}
              </p>
            )}
          </div>

          {/* Confirm Button */}
          <Button
            type="submit"
            disabled={isChangePasswordPending || !recaptchaToken}
            className="glassmorphism-primary-blue hover:bg-primary-blue/90 my-2 h-10 w-full rounded-lg px-4 py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isChangePasswordPending
              ? t("common.loading") || "Confirming..."
              : t("profile.edit.confirm") || "Confirm"}
          </Button>
        </Form>
      </div>
    </SheetModal>
  );
}
