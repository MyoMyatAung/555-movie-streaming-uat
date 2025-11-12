import { Button } from "@/components/ui/button";
import countriesAndDial from "@/constants/countryAndDial.json";
import { cn, isValidEmail, isValidMobile } from "@/lib/utils";
import useAuthStore from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";
import { Form } from "../form/Form";
import SocialLogin from "../SocialLogin";

export const LoginForm = ({
  onClose,
  onForgotPassword,
  onSignUp,
}: {
  onClose: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"username" | "mobile" | "email">(
    "username",
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { setRecaptchaToken, recaptchaToken } = useAuthStore();

  // Simple validation schema that works for both tabs
  const loginSchema = z
    .object({
      username: z.string().optional(),
      mobile: z.string().optional(),
      email: z.string().optional(),
      password: z.string().optional(),
      otp: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (activeTab === "mobile") {
        if (!data.mobile || data.mobile.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: t("profile.mobileNumberIsRequired"),
            path: ["mobile"],
          });
        } else if (data.mobile.length < 8) {
          ctx.addIssue({
            code: "custom",
            message: t("profile.mobileNumberMustBeAtLeast8Digits"),
            path: ["mobile"],
          });
        }
        if (!data.otp || data.otp.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: t("profile.otpIsRequired"),
            path: ["otp"],
          });
        }
      } else if (activeTab === "username") {
        if (!data.username || data.username.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: t("profile.usernameIsRequired"),
            path: ["username"],
          });
        }
        if (!data.password || data.password.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: t("profile.passwordIsRequired"),
            path: ["password"],
          });
        }
      } else {
        if (!data.email || data.email.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: t("profile.emailIsRequired"),
            path: ["email"],
          });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          ctx.addIssue({
            code: "custom",
            message: t("profile.pleaseEnterValidEmail"),
            path: ["email"],
          });
        }
        if (!data.otp || data.otp.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: t("profile.otpIsRequired"),
            path: ["otp"],
          });
        }
      }
    });

  const formMethods = useForm<any>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      mobile: "",
      email: "",
      password: "",
      otp: "",
    },
  });
  const [selectedCountry, setSelectedCountry] = useState("+66");
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const onSubmit = (data: any) => {
    setHasSubmitted(true);
    if (!recaptchaRef.current?.getValue()) {
      // toast.error(t("profile.pleaseCompleteRecaptcha"));
      return;
    }

    if (activeTab === "username") {
      console.log({
        account: data.username || "",
        password: data.password,
      });
    } else if (activeTab === "mobile") {
      console.log({
        countryCode: selectedCountry.replace("+", ""),
        phoneNumber: data.mobile || "",
        code: data.otp || "",
      });
    } else {
      console.log({
        email: data.email || "",
        code: data.otp || "",
      });
    }

    setHasSubmitted(false);

    // recaptchaRef.current.reset();
  };

  const onError = () => {
    setHasSubmitted(true);
  };

  function onChange(value: string | null) {
    setRecaptchaToken(value);
  }

  const handleTabChange = (tab: "username" | "mobile" | "email") => {
    setActiveTab(tab);
    setHasSubmitted(false);
    formMethods.clearErrors();
    formMethods.setValue("otp", "");
    formMethods.setValue("mobile", "");
    formMethods.setValue("email", "");
    formMethods.setValue("username", "");
    formMethods.setValue("password", "");
  };

  const handleSendOTP = (tab: "username" | "mobile" | "email") => {
    // if (!recaptchaToken) {
    //   toast.error(t("profile.pleaseCompleteRecaptcha"));
    //   return;
    // }

    const to =
      tab === "mobile"
        ? `${selectedCountry.replace("+", "")}${formMethods.getValues("mobile")}`
        : formMethods.getValues("email");

    console.log({
      to: to || "",
      channel: tab === "mobile" ? "sms" : "email",
      scene: "login",
    });
  };

  const watchedMobile = formMethods.watch("mobile");
  const watchedEmail = formMethods.watch("email");

  const isValidToGetOTP = useMemo(() => {
    const value = activeTab === "mobile" ? watchedMobile : watchedEmail;

    return (
      recaptchaToken &&
      value?.trim() &&
      (activeTab === "mobile" ? isValidMobile(value) : isValidEmail(value))
    );
  }, [activeTab, watchedMobile, watchedEmail, recaptchaToken]);

  return (
    <>
      {/* <FullScreenLoading
          isVisible={
            isEmailOtpLoginPending || isPhoneOtpLoginPending || isLoading
          }
        /> */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="relative mb-4 px-4 text-center text-white">
          <h1 className="text-[20px] font-medium">{t("profile.login")}</h1>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={onClose}
            className="absolute top-0 right-4"
          >
            <XIcon className="size-6" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex w-full justify-center gap-8 px-4">
          <button
            type="button"
            onClick={() => handleTabChange("username")}
            className={cn(
              "border-b-2 border-transparent bg-transparent pb-1.5 text-base text-gray-500",
              activeTab === "username" && "border-primary-blue text-white",
            )}
          >
            {t("profile.username")}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("mobile")}
            className={cn(
              "border-b-2 border-transparent bg-transparent pb-1.5 text-base text-gray-500",
              activeTab === "mobile" && "border-primary-blue text-white",
            )}
          >
            {t("profile.mobilePhone")}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("email")}
            className={cn(
              "border-b-2 border-transparent bg-transparent pb-1.5 text-base text-gray-500",
              activeTab === "email" && "border-primary-blue text-white",
            )}
          >
            {t("profile.email")}
          </button>
        </div>

        {/* Form */}
        <Form
          id="login"
          formMethods={formMethods}
          onSubmit={onSubmit}
          onError={onError}
          className="flex w-full flex-col items-center space-y-5 px-4"
        >
          {activeTab === "mobile" ? (
            <Form.MobileField
              key={activeTab + "-sign-in"}
              name="mobile"
              label={t("profile.mobileNumber")}
              variant="border"
              placeholder={t("profile.enterYourNumber")}
              countries={countriesAndDial.countries}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
          ) : activeTab === "email" ? (
            <Form.InputField
              name="email"
              label={t("profile.email")}
              variant="border"
              type="email"
              placeholder={t("profile.enterYourEmail")}
            />
          ) : (
            <Form.InputField
              name="username"
              label={t("profile.username")}
              variant="border"
              placeholder={t("profile.enterYourUsername")}
            />
          )}

          {activeTab === "username" ? (
            <Form.PasswordField
              name="password"
              label={t("profile.password")}
              variant="border"
              placeholder={t("profile.enterYourPassword")}
            />
          ) : (
            <Form.OTPField
              name="otp"
              label={t("profile.otp")}
              variant="border"
              placeholder={t("profile.enterYourOTP")}
              onResend={() => handleSendOTP(activeTab)}
              // disabled={!isValidToGetOTP}
            />
          )}
          <div>
            <ReCAPTCHA
              ref={recaptchaRef}
              stoken={recaptchaToken || ""}
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
              className="bg-primary-blue w-full text-base font-medium"
              disabled={false}
            >
              {t("profile.login")}
            </Button>

            {/* Forgot Password and Sign Up */}
            <div className="flex items-center justify-between text-base">
              <button
                type="button"
                className="text-sm text-white hover:underline"
                onClick={onForgotPassword}
              >
                {t("profile.forgotPassword")}
              </button>
              <button
                type="button"
                onClick={onSignUp}
                className="text-primary-blue text-sm hover:underline"
              >
                {t("profile.signUp")}
              </button>
            </div>

            {/* Divider */}
            <div className="flex w-full items-center gap-4">
              <div className="h-0.5 flex-1 bg-gray-200" />
              <span className="text-sm text-[#AAAAAA]">
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
