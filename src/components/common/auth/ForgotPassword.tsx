import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { Form } from "@/components/common/form/Form";
import { Button } from "@/components/ui/button";

type ForgotPasswordFormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ForgotPassword({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin?: () => void;
}) {
  const { t } = useTranslation();

  // Validation schema
  const forgotPasswordSchema = z
    .object({
      oldPassword: z
        .string()
        .min(1, t("auth.forgotPassword.oldPasswordRequired"))
        .min(6, t("auth.forgotPassword.passwordMinLength")),
      newPassword: z
        .string()
        .min(1, t("auth.forgotPassword.passwordRequired"))
        .min(8, t("auth.forgotPassword.passwordRequirements"))
        .max(25, t("auth.forgotPassword.passwordRequirements"))
        .refine((value) => {
          const hasLetter = /[A-Za-z]/.test(value);
          const hasNumber = /\d/.test(value);
          return Number(hasLetter) + Number(hasNumber) >= 2;
        }, t("auth.forgotPassword.passwordRequirements")),
      confirmPassword: z
        .string()
        .min(1, t("auth.forgotPassword.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("auth.forgotPassword.passwordsMustMatch"),
      path: ["confirmPassword"],
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
      message: t("auth.forgotPassword.newPasswordMustBeDifferent"),
      path: ["newPassword"],
    });

  const formMethods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    try {
      // TODO: Call change password API
      console.log("Change password:", data);
      toast.success(t("auth.forgotPassword.passwordResetSuccessfully"));
      onClose();
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast.error(
        error?.response?.data?.message ||
          t("auth.forgotPassword.failedToResetPassword"),
      );
    }
  };

  const onError = () => {
    // Handle form errors
  };

  return (
    <div className="flex h-[650px] flex-col pb-20 text-white">
      {/* Header */}
      <div className="relative mb-4 px-4 text-center">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={onClose}
          className="absolute top-0 left-4 rounded-full border border-white/10 shadow-sm"
        >
          <ArrowLeftIcon className="size-6" />
        </Button>
        <h1 className="text-[20px] font-medium text-white">
          {t("auth.forgotPassword.title")}
        </h1>
      </div>

      {/* Form */}
      <Form
        id="forgot-password"
        formMethods={formMethods}
        onSubmit={onSubmit}
        onError={onError}
        className="mt-8 flex w-full flex-col items-center space-y-5 px-4"
      >
        <Form.PasswordField
          name="oldPassword"
          label={t("auth.forgotPassword.oldPassword")}
          variant="border"
          placeholder={t("auth.forgotPassword.oldPasswordPlaceholder")}
        />

        <Form.PasswordField
          name="newPassword"
          label={t("auth.forgotPassword.newPassword")}
          variant="border"
          placeholder={t("auth.forgotPassword.enterNewPassword")}
        />

        <Form.InputField
          name="confirmPassword"
          label={t("auth.forgotPassword.confirmPassword")}
          variant="border"
          type="password"
          placeholder={t("auth.forgotPassword.enterConfirmPassword")}
        />

        <Button
          type="submit"
          size="lg"
          className="bg-primary-blue my-2 h-12 w-full text-base font-medium text-white"
        >
          {t("auth.forgotPassword.continue")}
        </Button>

        {/* Footer Link */}
        <div className="mt-4 flex items-center justify-center gap-2 text-base">
          <span className="text-white">
            {t("auth.forgotPassword.alreadyHaveAccount")}
          </span>
          <button
            type="button"
            onClick={onLogin || onClose}
            className="text-primary-blue font-medium hover:underline"
          >
            {t("profile.login")}
          </button>
        </div>
      </Form>
    </div>
  );
}
