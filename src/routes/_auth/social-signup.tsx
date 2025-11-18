import { useSocialRegister } from "@/apis/social";
import { Form } from "@/components/common/form/Form";
import { Button } from "@/components/ui/button";
import type { Mode } from "@/hooks/map/useMapUrlSync";
import useAuthStore from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { parseAsStringEnum, useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_auth/social-signup")({
  component: RouteComponent,
});

type SocialSignupFormData = {
  username: string;
  password: string;
  confirmPassword: string;
};

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const { mutateAsync: socialRegister } = useSocialRegister();
  const [{ mode }] = useQueryStates({
    mode: parseAsStringEnum<Mode>(["scan", "search", "map", "explore"]),
  });
  const signUpSchema = z
    .object({
      username: z
        .string()
        .min(1, t("auth.signUp.usernameRequired"))
        .min(3, "Username must be at least 3 characters"),
      password: z
        .string()
        .min(1, t("auth.signUp.passwordRequired"))
        .min(6, t("auth.forgotPassword.passwordMinLength")),
      confirmPassword: z
        .string()
        .min(1, t("auth.signUp.confirmPasswordRequired")),
    })
    .superRefine((data, ctx) => {
      if (!data.confirmPassword || data.confirmPassword !== data.password) {
        ctx.addIssue({
          code: "custom",
          message: t("auth.signUp.passwordNotMatch"),
          path: ["confirmPassword"],
        });
      }
    });

  const formMethods = useForm<SocialSignupFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SocialSignupFormData) => {
    const tempToken = sessionStorage.getItem("tempToken") as string;

    if (!tempToken) {
      toast.error(t("auth.signUp.socialSignupFailed"));
      navigate({ to: "/profile" });
      return;
    }

    const response = await socialRegister({
      username: data.username,
      password: data.password,
      tempToken: tempToken,
    });
    console.log("social signup response", response);

    if (response.data?.token) {
      setTokens(response.data.token);
      toast.success(t("auth.signUp.socialSignupSuccessful"));
      navigate({ to: "/profile", search: { mode: mode || "map" } });
    } else {
      toast.error(t("auth.signUp.socialSignupFailed"));
      navigate({ to: "/profile" });
    }
  };

  return (
    <div className="h-[calc(100vh-var(--bottom-nav-height)+var(topbar-height)] overflow-auto pb-24">
      <div className="grid h-[var(--topbar-height))] grid-cols-12 items-center bg-white px-4">
        <Link to="/profile" className="col-span-2">
          <Button size={"icon"} variant={"ghost"}>
            <ChevronLeft className="size-8" />
          </Button>
        </Link>
        <p className="col-span-8 text-center text-[20px] font-medium">
          {t("auth.signUp.title")}
        </p>
      </div>
      <div className="p-5 py-0">
        <Form
          id="social-signup"
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
          <Form.PasswordField
            name="password"
            label={t("auth.signUp.password")}
            variant="border"
            placeholder={t("auth.signUp.enterPassword")}
          />
          <Form.PasswordField
            name="confirmPassword"
            label={t("auth.signUp.confirmPassword")}
            variant="border"
            placeholder={t("auth.signUp.enterConfirmPassword")}
          />
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full text-base font-bold"
          >
            {t("auth.signUp.title")}
          </Button>
        </Form>
      </div>
    </div>
  );
}
