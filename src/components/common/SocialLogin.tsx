import { useGetSocialLoginUrl, useGetSocialProviders } from "@/apis/social";
import AppleIcon from "@/assets/svgs/apple.svg?react";
import FacebookFilledIcon from "@/assets/svgs/facebook-fill.svg?react";
import FacebookIcon from "@/assets/svgs/facebook.svg?react";
import GoogleFilledIcon from "@/assets/svgs/google-fill.svg?react";
import GoogleIcon from "@/assets/svgs/google.svg?react";
import WeChatFilledIcon from "@/assets/svgs/wechat-fill.svg?react";
import WeiboFilledIcon from "@/assets/svgs/weibo-fill.svg?react";
import { FullScreenLoading } from "@/components/common/FullscreenLoading";
import SheetModal from "@/components/common/SheetModal";
import { cn, getRedirectUri } from "@/lib/utils";
import { ChevronRightIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "../ui/button";

const SocialLoginModal = () => {
  const { t } = useTranslation();
  const { data: socialProviders, isPending: isSocialProvidersPending } =
    useGetSocialProviders();
  const { mutateAsync: getSocialLoginUrl, isPending } = useGetSocialLoginUrl();

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const allProviders = [
    {
      name: "google",
      icon: <GoogleFilledIcon className="size-6" />,
      label: t("auth.socialLogin.continueWithGoogle"),
    },
    {
      name: "facebook",
      icon: <FacebookFilledIcon className="size-6" />,
      label: t("auth.socialLogin.continueWithFacebook"),
    },
    {
      name: "wx",
      icon: <WeChatFilledIcon className="size-6" />,
      label: t("auth.socialLogin.continueWithWeChat"),
    },
    {
      name: "sina",
      icon: <WeiboFilledIcon className="size-6" />,
      label: t("auth.socialLogin.continueWithWeibo"),
    },
  ];

  const filteredProviders = allProviders.filter(
    (provider) =>
      (socialProviders as any)?.status[provider.name]?.supported &&
      (socialProviders as any)?.status[provider.name]?.configured,
  );

  const handleRegister = async (provider: string) => {
    setSelectedProvider(provider);
    const redirectUri = getRedirectUri({
      provider: provider as "google" | "facebook" | "wx" | "sina",
      intent: "register",
    });

    const socialLoginResponse = await getSocialLoginUrl({
      provider,
      redirect_uri: redirectUri,
    });

    console.log({ socialLoginResponse });

    setSelectedProvider(null);

    if (socialLoginResponse?.url) {
      window.location.href = socialLoginResponse.url;
      return;
    }

    toast(t("auth.socialLogin.socialLoginFailed"));
  };

  return (
    <>
      <FullScreenLoading isVisible={isPending || isSocialProvidersPending} />
      <div className="h-[420px] px-5">
        <div className="space-y-3">
          {filteredProviders.map((provider) => (
            <button
              key={provider.name}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-full border border-[#FFFFFF33] bg-transparent px-5 py-4 text-white",
                isPending && "opacity-50",
              )}
              onClick={() => handleRegister(provider.name)}
              disabled={isPending}
            >
              <div className="flex items-center gap-2">
                {provider.icon}
                <p className="text-base font-medium">{provider.label}</p>
              </div>
              {selectedProvider === provider.name && isPending ? (
                <Loader2Icon className="text-primary-yellow size-5 animate-spin font-medium" />
              ) : (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

const SocialLogin = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setShowModal(true)}
        type="button"
        variant="ghost"
        size="lg"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#FFFFFF33] bg-transparent px-6 py-4 text-base font-medium text-white drop-shadow-2xl drop-shadow-white/10 backdrop-blur-[3px] hover:bg-transparent hover:text-white"
      >
        <span>{t("auth.socialLogin.continueWithSocial")}</span>
        <div className="flex items-center gap-2">
          <GoogleIcon className="path-fill-white size-5" />
          <FacebookIcon className="size-5" />
          <AppleIcon className="mb-1 size-5.5" />
        </div>
      </Button>
      <SheetModal
        detent="content"
        showModal={showModal}
        setShowModal={(value) => setShowModal(value)}
        title={t("auth.socialLogin.title")}
        onClose={() => setShowModal(false)}
        containerClassName="bg-dark-gray!"
      >
        <SocialLoginModal />
      </SheetModal>
    </div>
  );
};

export default SocialLogin;
