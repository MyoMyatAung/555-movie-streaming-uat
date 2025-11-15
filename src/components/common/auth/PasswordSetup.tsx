import { useAccountSetup } from "@/apis/auth/mutationAccountSetup";
import { Form } from "@/components/common/form/Form";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

const createSchema = (t: any) =>
  z
    .object({
      nickname: z.string().optional(),
      newPassword: z
        .string()
        .min(8, t("profile.settings.passwordRequirements"))
        .max(25, t("profile.settings.passwordRequirements"))
        .refine((value) => {
          const hasLetter = /[A-Za-z]/.test(value);
          const hasNumber = /\d/.test(value);
          return Number(hasLetter) + Number(hasNumber) >= 2;
        }, t("profile.settings.passwordRequirements")),
      confirmPassword: z
        .string()
        .min(8, t("profile.settings.passwordRequirements"))
        .max(25, t("profile.settings.passwordRequirements"))
        .refine((value) => {
          const hasLetter = /[A-Za-z]/.test(value);
          const hasNumber = /\d/.test(value);
          return Number(hasLetter) + Number(hasNumber) >= 2;
        }, t("profile.settings.passwordRequirements")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("profile.settings.passwordsNotMatch"),
      path: ["confirmPassword"],
    });

export const PasswordSetupForm = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { setTokens } = useAuthStore();

  const { mutate: accountSetup } = useAccountSetup();

  const schema = createSchema(t);
  type FormData = z.infer<typeof schema>;

  const formMethods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nickname: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    accountSetup(
      {
        token: localStorage.getItem("registerToken") as string,
        nickname: data.nickname ?? "",
        password: data.newPassword,
      },
      {
        onSuccess: (response) => {
          console.log({ response });
          setTokens({
            access_token: response.data?.access_token ?? "",
            token_type: response.data?.token_type ?? "",
            expires_in: response.data?.expires_in ?? 0,
          });
          localStorage.removeItem("registerToken");
          onClose();
          // toast.success(t("profile.settings.passwordUpdatedSuccessfully"));
        },
        onError: (error: any) => {
          console.error("Failed to account setup:", error);
          localStorage.removeItem("registerToken");
          onClose();
          // toast.info(error?.response?.data?.message);
        },
      },
    );
  };

  return (
    <div className="mb-10 flex flex-col text-white">
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
      <Form
        id="account-setup"
        formMethods={formMethods}
        onSubmit={handleSubmit}
      >
        <div className="mt-8 flex w-full flex-col items-center space-y-8 px-4">
          <Form.PasswordField
            name="newPassword"
            label={t("auth.signUp.newPassword")}
            variant="border"
          />
          <Form.PasswordField
            name="confirmPassword"
            label={t("auth.signUp.retypeNewPassword")}
            variant="border"
          />
          <div className="w-full">
            <Form.InputField
              name="nickname"
              label={t("auth.signUp.nickname")}
              variant="border"
            />
            <p className="p-1 text-sm text-[#AAAAAA]">{t("common.optional")}</p>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full text-base font-medium"
          >
            {t("common.continue")}
          </Button>
        </div>
      </Form>
    </div>
  );
};
