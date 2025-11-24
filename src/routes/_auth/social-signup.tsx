import { useSocialRegister } from "@/apis/social";
import { Form } from "@/components/common/form/Form";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, RefreshCcw, User } from "lucide-react";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export const Route = createFileRoute("/_auth/social-signup")({
  component: RouteComponent,
});

type SocialSignupFormData = {
  username: string;
  password: string;
};

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: socialRegister, isPending } = useSocialRegister({
    onSuccess: (response) => {
      console.log({ response });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const [hasSubmitted] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { setRecaptchaToken, recaptchaToken, setTokens } = useAuthStore();

  const signUpSchema = z.object({
    username: z
      .string()
      .min(1, t("auth.signUp.usernameRequired"))
      .min(3, "Username must be at least 3 characters"),
    password: z
      .string()
      .min(1, t("auth.signUp.passwordRequired"))
      .min(6, t("auth.forgotPassword.passwordMinLength")),
  });

  const formMethods = useForm<SocialSignupFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SocialSignupFormData) => {
    const tempToken = sessionStorage.getItem("tempToken") as string;

    console.log({ tempToken });
    if (!tempToken) {
      toast.error(t("auth.signUp.socialSignupFailed"));
      navigate({ to: "/profile" });
      return;
    }

    const response = await socialRegister({
      username: data.username,
      password: data.password,
      temp_token: tempToken,
    });

    if (response.data?.token) {
      setTokens({
        access_token: response.data.token.access_token,
        token_type: response.data.token.token_type || "Bearer",
        expires_in: response.data.token.expires_in || 0,
      });
      toast.success(t("auth.signUp.socialSignupSuccessful"));
      navigate({ to: "/profile" });
    } else {
      toast.error(t("auth.signUp.socialSignupFailed"));
      navigate({ to: "/profile" });
    }
  };

  function onChange(value: string | null) {
    setRecaptchaToken(value);
  }

  const socialUserInfoRaw = sessionStorage.getItem("socialUserInfo") as string;
  const socialUserInfo = JSON.parse(socialUserInfoRaw) || {};

  return (
    <div className="h-[calc(100vh-var(--bottom-nav-height)+var(topbar-height)] overflow-auto pb-24">
      <div className="my-2 grid h-[var(--topbar-height))] grid-cols-12 items-center px-4">
        <Link to="/profile" className="col-span-2">
          <Button size={"icon"} variant={"ghost"}>
            <ChevronLeft className="size-6 text-white" />
          </Button>
        </Link>
        <p className="col-span-8 text-center text-lg font-medium text-white">
          {t("auth.signUp.accountBinding")}
        </p>
      </div>

      <div className="p-5">
        <div className="mb-5 flex w-full items-center justify-between gap-4 rounded-lg border border-white/10 p-2">
          {socialUserInfo.avatar ? (
            <img
              src={socialUserInfo.avatar}
              alt={socialUserInfo.nickname}
              className="size-10 rounded-full"
            />
          ) : (
            <User className="size-10" />
          )}
          <p className="flex-1 text-white">{socialUserInfo.nickname}</p>
          <RefreshCcw className="size-5 text-[#AAAAAA]" />
        </div>
        {/* <p className="my-2 text-sm text-white">
          Login successful, bind this social to an existing account or create a
          new one.
        </p> */}
        {/* <Tabs defaultValue="create">
          <TabsList className="mx-auto my-5 bg-transparent">
            <TabsTrigger
              value="bind"
              className="data-[state=active]:border-primary-blue mx-2 rounded-none border-0 border-b-2 px-0 font-medium text-white data-[state=active]:bg-transparent"
            >
              Bind Account
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:border-primary-blue mx-2 rounded-none border-0 border-b-2 px-0 font-medium text-white data-[state=active]:bg-transparent"
            >
              Create Account
            </TabsTrigger>
          </TabsList>
        </Tabs> */}
        <Form
          id="social-bind"
          formMethods={formMethods}
          onSubmit={onSubmit}
          className="flex w-full flex-col items-center space-y-5"
        >
          <Form.InputField
            name="username"
            label={t("auth.signUp.username")}
            variant="border"
            placeholder={t("auth.signUp.enterUsername")}
          />
          <div>
            <Form.PasswordField
              name="password"
              label={t("auth.signUp.password")}
              variant="border"
              placeholder={t("auth.signUp.enterPassword")}
            />
            <p className="p-1 text-xs text-[#AAAAAA]">
              Password must be 8–20 characters and include letters, numbers, and
              symbols
            </p>
          </div>
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

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full text-base font-bold"
            disabled={isPending}
          >
            {t("auth.signUp.bindAccount")}
          </Button>
        </Form>
      </div>
    </div>
  );
}
