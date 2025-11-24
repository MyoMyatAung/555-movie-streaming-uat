import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { useForgotPasswordReset } from "@/apis/auth/mutationForgotPasswordReset";
import { useSendOTP } from "@/apis/otp/mutationSendOTP";
import { useVerifyOTP } from "@/apis/otp/mutationVerifyOTP";

import { Form } from "@/components/common/form/Form";
import { Button } from "@/components/ui/button";
import { isValidEmail, isValidMobile } from "@/lib/utils";
import useAuthStore from "@/stores/useAuthStore";

type Step1FormData = {
  account?: string;
  otp: string;
};

type Step2FormData = {
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
  const [step, setStep] = useState<1 | 2>(1);
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [lastVerifiedOtp, setLastVerifiedOtp] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { setRecaptchaToken, recaptchaToken } = useAuthStore();
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const { mutate: sendOTP, isPending: isSendOTPPending } = useSendOTP({
    onSuccess: () => {
      toast.success(t("auth.forgotPassword.codeSentSuccessfully"));
    },
    onError: (error: any) => {
      console.error("Failed to send OTP:", error);
      toast.error(
        error?.response?.data?.message ||
          t("auth.forgotPassword.failedToSendCode"),
      );
    },
  });

  const { mutateAsync: verifyOTP, isPending: isVerifyOTPPending } =
    useVerifyOTP();

  const { mutateAsync: resetPassword, isPending: isResetPending } =
    useForgotPasswordReset();

  // Helper function to detect if account is email or phone
  const detectChannel = (account: string): "email" | "phone" => {
    if (isValidEmail(account)) {
      return "email";
    }
    if (isValidMobile(account)) {
      return "phone";
    }
    // Default to email if format is unclear
    return "email";
  };

  // Step 1: Email/Phone + OTP validation schema
  const step1Schema = z
    .object({
      account: z.string().optional(),
      otp: z.string().min(1, t("auth.signUp.otpRequired")),
    })
    .superRefine((data, ctx) => {
      if (!data.account || data.account.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: t("auth.forgotPassword.accountRequired"),
          path: ["account"],
        });
      } else {
        const accountValue = data.account.trim();
        const isEmail = isValidEmail(accountValue);
        const isPhone = isValidMobile(accountValue);

        if (!isEmail && !isPhone) {
          ctx.addIssue({
            code: "custom",
            message: t("auth.forgotPassword.invalidAccountFormat"),
            path: ["account"],
          });
        }
      }
    });

  // Step 2: Password validation schema
  const step2Schema = z
    .object({
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
    });

  const step1FormMethods = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      account: "",
      otp: "",
    },
  });

  const step2FormMethods = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchedAccount = step1FormMethods.watch("account");
  const watchedOtp = step1FormMethods.watch("otp");

  const isValidToGetOTP = useMemo(() => {
    const value = watchedAccount?.trim();
    if (!value || !recaptchaToken) return false;
    return isValidEmail(value) || isValidMobile(value);
  }, [watchedAccount, recaptchaToken]);

  // Auto-verify OTP when 6 digits are entered
  useEffect(() => {
    if (step !== 1) return;

    const normalizedOtp = watchedOtp.trim();

    if (normalizedOtp.length !== 6 || !/^\d{6}$/.test(normalizedOtp)) {
      if (lastVerifiedOtp !== null) {
        setLastVerifiedOtp(null);
      }
      return;
    }

    if (
      normalizedOtp === lastVerifiedOtp ||
      isVerifyOTPPending ||
      !isValidToGetOTP
    ) {
      return;
    }

    const accountValue = step1FormMethods.getValues("account");
    const recipient = accountValue?.trim() || "";

    if (!recipient) {
      return;
    }

    const channel = detectChannel(recipient);

    setLastVerifiedOtp(normalizedOtp);

    const verify = async () => {
      try {
        const response = await verifyOTP({
          channel,
          recipient,
          otp: normalizedOtp,
          action: "forgot-password",
        });

        const token = response.data?.token;
        if (token) {
          step1FormMethods.clearErrors("otp");
          setOtpToken(token);
          setStep(2);
        } else {
          setOtpToken(null);
          step1FormMethods.setError("otp", {
            type: "manual",
            message: t("auth.signUp.invalidOtp"),
          });
          toast.error(response.message ?? t("auth.signUp.invalidOtp"));
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          t("auth.signUp.invalidOtp");

        step1FormMethods.setError("otp", {
          type: "manual",
          message: errorMessage,
        });
        toast.error(errorMessage);
      }
    };

    void verify();
  }, [
    step,
    watchedOtp,
    lastVerifiedOtp,
    isVerifyOTPPending,
    isValidToGetOTP,
    step1FormMethods,
    verifyOTP,
    t,
  ]);

  const handleSendOTP = () => {
    step1FormMethods.clearErrors("otp");

    const account = step1FormMethods.getValues("account") || "";
    const recipient = account.trim();

    if (!recipient) {
      toast.error(t("auth.forgotPassword.accountRequired"));
      return;
    }

    const channel = detectChannel(recipient);

    sendOTP({
      recipient,
      channel,
      action: "forgot-password",
    });
  };

  const handleStep1Submit = () => {
    // OTP verification is handled automatically in useEffect
    if (!otpToken) {
      toast.error(t("auth.signUp.invalidOtp"));
    }
  };

  const handleStep2Submit = async (data: Step2FormData) => {
    if (!otpToken) {
      toast.error(t("auth.signUp.invalidOtp"));
      setStep(1);
      return;
    }

    try {
      await resetPassword({
        token: otpToken,
        password: data.newPassword,
        password_confirmation: data.confirmPassword,
      });
      toast.success(t("auth.forgotPassword.passwordResetSuccessfully"));
      onClose();
    } catch (error: any) {
      console.error("Failed to reset password:", error);
      toast.error(
        error?.response?.data?.message ||
          t("auth.forgotPassword.failedToResetPassword"),
      );
    }
  };

  return (
    <div className="flex h-[650px] flex-col pb-20 text-white">
      {/* Header */}
      <div className="relative px-4 text-center">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={step === 2 ? () => setStep(1) : onClose}
          className="absolute top-0 left-4 rounded-full border border-white/10 shadow-sm"
        >
          <ArrowLeftIcon className="size-6" />
        </Button>
        <h1 className="text-[20px] font-medium text-white">
          {t("auth.forgotPassword.title")}
        </h1>
        {step === 2 && (
          <p className="mt-8 px-1 text-left text-white">
            {t("auth.forgotPassword.chooseNewPasswordSubtitle")}
          </p>
        )}
      </div>

      {step === 1 ? (
        <>
          {/* Step 1 Form */}
          <Form
            id="forgot-password-step1"
            formMethods={step1FormMethods}
            onSubmit={handleStep1Submit}
            className="mt-10 flex w-full flex-col items-center space-y-5 px-4"
          >
            <Form.InputField
              name="account"
              label={t("auth.forgotPassword.accountLabel")}
              variant="border"
              type="text"
              placeholder={t("auth.forgotPassword.accountPlaceholder")}
            />

            <Form.OTPField
              name="otp"
              label={t("auth.signUp.otp")}
              variant="border"
              placeholder={t("auth.signUp.enterOTP")}
              onResend={handleSendOTP}
              disabled={!isValidToGetOTP || isSendOTPPending}
            />

            <div>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onChange={(value) => setRecaptchaToken(value)}
                onExpired={() => setRecaptchaToken(null)}
                onErrored={() => setRecaptchaToken(null)}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="bg-primary-blue my-2 h-12 w-full text-base font-medium text-white"
              disabled={!otpToken}
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
        </>
      ) : (
        /* Step 2 Form */
        <Form
          id="forgot-password-step2"
          formMethods={step2FormMethods}
          onSubmit={handleStep2Submit}
          className="mt-8 flex w-full flex-col items-center space-y-5 px-4"
        >
          <Form.PasswordField
            name="newPassword"
            label={t("auth.forgotPassword.newPassword")}
            variant="border"
            placeholder={t("auth.forgotPassword.enterNewPassword")}
          />

          <Form.PasswordField
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
            disabled={isResetPending}
          >
            {isResetPending
              ? t("common.loading")
              : t("auth.forgotPassword.continue")}
          </Button>
        </Form>
      )}
    </div>
  );
}
