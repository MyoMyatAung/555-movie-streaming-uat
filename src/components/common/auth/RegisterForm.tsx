import FullScreenLoading from "../FullScreenLoading";
import SocialLogin from "../SocialLogin";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";

import { useRegister } from "@/apis/auth/mutationRegister";
import { useSendOTP } from "@/apis/otp/mutationSendOTP";
import { useVerifyOTP } from "@/apis/otp/mutationVerifyOTP";
import { Form } from "@/components/common/form/Form";
import { Button } from "@/components/ui/button";
import countriesAndDial from "@/constants/countryAndDial.json";
import { cn, isValidEmail, isValidMobile } from "@/lib/utils";
import useAuthStore from "@/stores/useAuthStore";
// import FullScreenLoading from "../common/FullScreenLoading";

type SignUpFormData = {
  username: string;
  password: string;
  mobile?: string;
  email?: string;
  otp: string;
};

const RegisterForm = ({
  onSignIn,
  onClose,
}: {
  onSignIn: () => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { setRecaptchaToken, recaptchaToken, setTokens } = useAuthStore();

  const { mutateAsync: register, isPending: isRegisterPending } = useRegister();

  const { mutate: sendOTP, isPending: isSendOTPPending } = useSendOTP({
    onSuccess: () => {
      toast.success(t("auth.signUp.otpSentSuccessfully"));
    },
    onError: (error: any) => {
      recaptchaRef.current?.reset();
      console.error("Failed to send OTP:", error);
      toast.info(
        error?.response?.data?.message?.replace(".", "\n") ||
          t("auth.signUp.failedToSendOTP"),
      );
    },
  });
  const { mutateAsync: verifyOTP, isPending: isVerifyOTPPending } =
    useVerifyOTP();

  const [activeTab, setActiveTab] = useState<"mobile" | "email">("mobile");
  const [otpToken, setOtpToken] = useState<string | null>(null);

  // Validation schema for sign up
  const signUpSchema = z
    .object({
      username: z
        .string()
        .min(1, t("auth.signUp.usernameRequired"))
        .min(3, t("auth.signUp.usernameMinLength"))
        .max(25, t("auth.signUp.usernameMaxLength")),
      password: z
        .string()
        .min(1, t("auth.signUp.passwordRequired"))
        .min(6, t("auth.forgotPassword.passwordMinLength")),
      mobile: z.string().optional(),
      email: z.string().optional(),
      otp: z.string().min(1, t("auth.signUp.otpRequired")),
    })
    .superRefine((data, ctx) => {
      if (activeTab === "mobile") {
        if (!data.mobile || data.mobile.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: t("auth.signUp.mobileRequired"),
            path: ["mobile"],
          });
        } else if (data.mobile.length < 8) {
          ctx.addIssue({
            code: "custom",
            message: t("profile.mobileNumberMustBeAtLeast8Digits"),
            path: ["mobile"],
          });
        }
      } else {
        if (!data.email || data.email.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: t("auth.signUp.emailRequired"),
            path: ["email"],
          });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          ctx.addIssue({
            code: "custom",
            message: t("auth.signUp.validEmailRequired"),
            path: ["email"],
          });
        }
      }
    });

  const formMethods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      mobile: "",
      email: "",
      otp: "",
    },
  });
  const [selectedCountry, setSelectedCountry] = useState("+66");
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lastVerifiedOtp, setLastVerifiedOtp] = useState<string | null>(null);

  const onError = () => {
    setHasSubmitted(true);
  };

  const onSubmit = async (data: SignUpFormData) => {
    if (!otpToken) {
      toast.error(t("auth.signUp.invalidOtp"));
      return;
    }

    const response = await register({
      token: otpToken,
      username: data.username,
      password: data.password,
    });

    if (!response.data?.access_token) {
      toast.error(t("auth.signUp.signUpFailed"));
      return;
    }
    setTokens({
      access_token: response.data.access_token,
      token_type: response.data.token_type || "",
      expires_in: response.data.expires_in || 0,
    });

    recaptchaRef.current?.reset();
    toast.success(t("auth.signUp.signUpSuccessful"));
    onClose();
    // navigate({ to: "/profile" });
  };

  function onChange(value: string | null) {
    setRecaptchaToken(value);
  }

  const handleTabChange = (tab: "mobile" | "email") => {
    setActiveTab(tab);
    setHasSubmitted(false);
    formMethods.setValue("otp", "");
    formMethods.clearErrors();
  };

  const handleSendOTP = (tab: "mobile" | "email") => {
    // if (!recaptchaToken) {
    //   toast.error(t("auth.signUp.pleaseCompleteRecaptcha"));
    //   return;
    // }

    // Clear OTP field error when sending OTP
    formMethods.clearErrors("otp");

    const to =
      tab === "mobile"
        ? (() => {
            const dialCode = selectedCountry.replace("+", "");
            return `${dialCode.replace("+", "")}${formMethods.getValues("mobile")}`;
          })()
        : formMethods.getValues("email");
    sendOTP({
      recipient: to || "",
      channel: tab === "mobile" ? "phone" : "email",
      action: "register",
    });
  };

  const watchedMobile = formMethods.watch("mobile");
  const watchedEmail = formMethods.watch("email");
  const watchedOtp = formMethods.watch("otp");

  const getValues = formMethods.getValues;
  const setError = formMethods.setError;
  const clearErrors = formMethods.clearErrors;

  const isValidToGetOTP = useMemo(() => {
    const value = activeTab === "mobile" ? watchedMobile : watchedEmail;

    return (
      recaptchaToken &&
      value?.trim() &&
      (activeTab === "mobile" ? isValidMobile(value) : isValidEmail(value))
    );
  }, [activeTab, watchedMobile, watchedEmail, recaptchaToken]);

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

    const recipient =
      activeTab === "mobile"
        ? (() => {
            const dialCode = selectedCountry.replace("+", "");
            const mobileValue = getValues("mobile") ?? "";
            const mobile = mobileValue.trim();
            return mobile ? `${dialCode}${mobile}` : "";
          })()
        : (() => {
            const emailValue = getValues("email") ?? "";
            return emailValue.trim();
          })();

    if (!recipient) {
      return;
    }

    setLastVerifiedOtp(normalizedOtp);

    const verify = async () => {
      try {
        const response = await verifyOTP({
          channel: activeTab === "mobile" ? "phone" : "email",
          recipient,
          otp: normalizedOtp,
          action: "register",
        });

        const token = response.data?.token;
        if (token) {
          clearErrors("otp");
          setOtpToken(token);
        } else {
          setOtpToken(null);
          setError("otp", {
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

        setError("otp", {
          type: "manual",
          message: errorMessage,
        });
        toast.error(errorMessage);
      }
    };

    void verify();
  }, [
    activeTab,
    clearErrors,
    getValues,
    isValidToGetOTP,
    isVerifyOTPPending,
    lastVerifiedOtp,
    selectedCountry,
    setError,
    t,
    verifyOTP,
    watchedOtp,
  ]);

  return (
    <>
      <FullScreenLoading isVisible={isRegisterPending} />
      <div className="flex flex-col pb-20 text-white">
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
            {t("auth.signUp.title")}
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex w-full justify-center gap-8 px-4">
          <button
            type="button"
            onClick={() => handleTabChange("mobile")}
            className={cn(
              "border-b-2 border-transparent bg-transparent pb-1.5 text-base font-medium text-[#AAAAAA]",
              activeTab === "mobile" && "border-primary-blue text-white",
            )}
          >
            {t("profile.mobilePhone")}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("email")}
            className={cn(
              "border-b-2 border-transparent bg-transparent pb-1.5 text-base font-medium text-[#AAAAAA]",
              activeTab === "email" && "border-primary-blue text-white",
            )}
          >
            {t("auth.signUp.email")}
          </button>
        </div>

        {/* Form */}
        <Form
          id="sign-up"
          formMethods={formMethods}
          onSubmit={onSubmit}
          onError={onError}
          className="flex w-full flex-col items-center space-y-5 px-4"
        >
          <Form.InputField
            name="username"
            label={t("auth.signUp.username")}
            variant="border"
            placeholder={t("auth.signUp.enterUsername")}
          />
          <Form.PasswordField
            name="password"
            label={t("auth.signUp.password")}
            variant="border"
            placeholder={t("auth.signUp.enterPassword")}
          />

          {activeTab === "mobile" ? (
            <Form.MobileField
              key="sign-up"
              name="mobile"
              label={t("auth.signUp.mobile")}
              variant="border"
              placeholder={t("auth.signUp.enterMobile")}
              countries={countriesAndDial.countries}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
          ) : (
            <Form.InputField
              name="email"
              label={t("auth.signUp.email")}
              variant="border"
              type="email"
              placeholder={t("auth.signUp.enterEmail")}
            />
          )}
          <Form.OTPField
            name="otp"
            label={t("auth.signUp.otp")}
            variant="border"
            placeholder={t("auth.signUp.enterOTP")}
            onResend={() => handleSendOTP(activeTab)}
            disabled={!isValidToGetOTP || isSendOTPPending}
          />
          <div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              onChange={onChange}
              onExpired={() => setRecaptchaToken(null)}
              onErrored={() => setRecaptchaToken(null)}
            />
            {hasSubmitted && !recaptchaToken && (
              <p className="text-destructive my-1 text-sm">
                {t("profile.pleaseCompleteRecaptcha")}
              </p>
            )}
          </div>

          <div className="w-full space-y-4">
            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-medium"
              disabled={!otpToken || isRegisterPending}
            >
              {t("auth.signUp.title")}
            </Button>
            <div className="flex items-center justify-center gap-2 text-base">
              <span className="text-white">
                {t("auth.signUp.alreadyHaveAccount")}
              </span>
              <button
                type="button"
                onClick={onSignIn}
                className="text-primary-blue font-medium hover:underline"
              >
                {t("profile.login")}
              </button>
            </div>

            {/* Divider */}
            <div className="flex w-full items-center gap-4">
              <div className="h-0.5 flex-1 bg-gray-200" />
              <span className="text-sm text-gray-400">
                {t("profile.orSignInWith")}
              </span>
              <div className="h-0.5 flex-1 bg-gray-200" />
            </div>

            {/* Social login */}
            <SocialLogin />
          </div>
        </Form>
      </div>
    </>
  );
};

export default RegisterForm;
