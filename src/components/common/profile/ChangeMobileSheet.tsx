import { useSendOTP } from "@/apis/otp/mutationSendOTP";
import { useVerifyOTP } from "@/apis/otp/mutationVerifyOTP";
import { useChangePhone } from "@/apis/profile";
import { Form } from "@/components/common/form/Form";
import SheetModal from "@/components/common/SheetModal";
import { Button } from "@/components/ui/button";
import countriesAndDial from "@/constants/countryAndDial.json";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod";
import { FullScreenLoading } from "../FullscreenLoading";

interface ChangeMobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone?: string;
}

const createSchema = (t: any) =>
  z.object({
    mobile: z
      .string()
      .min(1, t("auth.signUp.mobileRequired") || "Mobile number is required")
      .min(
        8,
        t("profile.mobileNumberMustBeAtLeast8Digits") ||
          "Mobile number must be at least 8 digits",
      ),
    otp: z.string().min(1, t("auth.signUp.otpRequired") || "OTP is required"),
  });

export function ChangeMobileSheet({
  isOpen,
  onClose,
  currentPhone = "",
}: ChangeMobileSheetProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { updateUser, recaptchaToken, setRecaptchaToken } = useAuthStore();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const [selectedCountry, setSelectedCountry] = useState("+66");

  const schema = createSchema(t);
  type FormData = z.infer<typeof schema>;

  const formMethods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      mobile: "",
      otp: "",
    },
  });

  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [lastVerifiedOtp, setLastVerifiedOtp] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      formMethods.reset({
        mobile: "",
        otp: "",
      });
      setOtpToken(null);
      setLastVerifiedOtp(null);
      setHasSubmitted(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  }, [isOpen, formMethods, setRecaptchaToken]);

  const { mutateAsync: changePhone, isPending: isChangePhonePending } =
    useChangePhone({
      onSuccess: (response) => {
        if (response?.status) {
          const mobile = formMethods.getValues("mobile");
          const dialCode = selectedCountry.replace("+", "");
          const fullPhone = `+${dialCode}${mobile}`;
          updateUser({ phone: fullPhone });
          toast.success(
            t("profile.settings.mobileUpdatedSuccessfully") ||
              "Mobile number updated successfully",
          );
          queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
          onClose();
        } else {
          toast.error(
            response?.message ||
              t("profile.settings.failedToUpdateMobile") ||
              "Failed to update mobile number",
          );
        }
      },
      onError: (error) => {
        console.error("Error changing phone:", error);
        const errorMessage =
          error?.response?.data?.error?.detail ||
          error?.message ||
          t("profile.settings.failedToUpdateMobile") ||
          "Failed to update mobile number";
        toast.error(errorMessage);
      },
    });

  const { mutate: sendOTP, isPending: isSendOTPPending } = useSendOTP({
    onSuccess: () => {
      toast.success(t("auth.signUp.otpSentSuccessfully"));
    },
    onError: (error: any) => {
      recaptchaRef.current?.reset();
      console.error("Failed to send OTP:", error);
      toast.error(
        error?.response?.data?.message || t("auth.signUp.failedToSendOTP"),
      );
    },
  });

  const { mutateAsync: verifyOTP, isPending: isVerifyOTPPending } =
    useVerifyOTP();

  const watchedMobile = formMethods.watch("mobile");

  const isValidMobile = (mobile: string) => {
    return /^\d+$/.test(mobile) && mobile.length >= 8;
  };

  const isValidToGetOTP = useMemo(() => {
    const dialCode = selectedCountry.replace("+", "");
    const fullPhone = `+${dialCode}${watchedMobile?.trim() || ""}`;
    return (
      recaptchaToken && watchedMobile?.trim() && isValidMobile(watchedMobile)
    );
  }, [watchedMobile, recaptchaToken, selectedCountry, currentPhone]);

  const handleSendOTP = () => {
    if (!recaptchaToken) {
      toast.error(t("auth.signUp.pleaseCompleteRecaptcha"));
      return;
    }

    formMethods.clearErrors("otp");

    const dialCode = selectedCountry.replace("+", "");
    const mobile = formMethods.getValues("mobile")?.trim() || "";
    const fullPhone = `+${dialCode}${mobile}`;

    sendOTP({
      recipient: fullPhone,
      channel: "phone",
      action: "change-phone",
    });
  };

  const watchedOtp = formMethods.watch("otp");

  // Auto-verify OTP when 6 digits are entered
  useEffect(() => {
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

    const dialCode = selectedCountry.replace("+", "");
    const mobile = formMethods.getValues("mobile")?.trim() || "";
    const fullPhone = `+${dialCode}${mobile}`;

    if (!fullPhone || !mobile) {
      return;
    }

    setLastVerifiedOtp(normalizedOtp);

    const verify = async () => {
      try {
        const response = await verifyOTP({
          channel: "phone",
          recipient: fullPhone,
          otp: normalizedOtp,
          action: "change-phone",
        });

        const token = response.data?.token;
        if (token) {
          formMethods.clearErrors("otp");
          setOtpToken(token);
        } else {
          setOtpToken(null);
          formMethods.setError("otp", {
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

        formMethods.setError("otp", {
          type: "manual",
          message: errorMessage,
        });
        toast.error(errorMessage);
      }
    };

    void verify();
  }, [
    watchedOtp,
    lastVerifiedOtp,
    isVerifyOTPPending,
    isValidToGetOTP,
    formMethods,
    verifyOTP,
    t,
    selectedCountry,
  ]);

  const handleSubmit = async (data: FormData) => {
    if (!otpToken) {
      toast.error(t("auth.signUp.invalidOtp"));
      return;
    }

    const dialCode = selectedCountry.replace("+", "");
    const fullPhone = `+${dialCode}${data.mobile.trim()}`;

    if (fullPhone === currentPhone) {
      toast.error(
        t("profile.settings.phoneSameAsCurrent") ||
          "New phone number must be different from current phone number",
      );
      return;
    }

    setHasSubmitted(true);

    try {
      await changePhone({ phone: fullPhone });
    } catch (error) {
      // Error is handled in the mutation's onError callback
      console.error("Failed to change phone:", error);
    }
  };

  const onError = () => {
    setHasSubmitted(true);
  };

  const onChange = (value: string | null) => {
    setRecaptchaToken(value);
  };

  if (isChangePhonePending) {
    return <FullScreenLoading isVisible={isChangePhonePending} />;
  }

  return (
    <SheetModal
      detent="content"
      showModal={isOpen}
      setShowModal={onClose}
      title={t("profile.settings.changeMobile") || "Change Mobile Number"}
      onClose={onClose}
      containerClassName="!bg-dark-gray"
    >
      <div className="h-[450px] px-4 pt-4 pb-6">
        <Form
          id="change-mobile-form"
          formMethods={formMethods}
          onSubmit={handleSubmit}
          onError={onError}
          className="flex w-full flex-col items-center space-y-5"
        >
          {/* Mobile Input Field */}
          <Form.MobileField
            name="mobile"
            label={t("auth.signUp.mobile") || "Phone Number"}
            variant="border"
            placeholder={
              t("auth.signUp.enterMobile") || "Enter your phone number"
            }
            countries={countriesAndDial.countries}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
          />

          {/* OTP Input Field */}
          <Form.OTPField
            name="otp"
            label={t("auth.signUp.otp") || "OTP"}
            variant="border"
            placeholder={t("auth.signUp.enterOTP") || "Enter OTP"}
            onResend={handleSendOTP}
            disabled={!isValidToGetOTP || isSendOTPPending}
          />

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
            disabled={!otpToken || isChangePhonePending}
            className="glassmorphism-primary-blue hover:bg-primary-blue/90 my-2 h-10 w-full rounded-lg px-4 py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isChangePhonePending
              ? t("common.loading") || "Confirming..."
              : t("profile.edit.confirm") || "Confirm"}
          </Button>
        </Form>
      </div>
    </SheetModal>
  );
}
