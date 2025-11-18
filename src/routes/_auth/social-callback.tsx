import { useSocialLoginCallback } from "@/apis/social";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/social-callback")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      provider: search.provider,
      intent: search.intent,
      code: search.code,
    };
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  //   const { setTokens } = useAuthStore();

  const { provider, intent, code } = useSearch({
    from: "/_auth/social-callback",
  });

  const { mutateAsync: socialLoginCallback, isPending } =
    useSocialLoginCallback();

  const handleCallback = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!code) {
      toast.error("Social login failed");
      navigate({ to: "/profile" });
      return;
    }

    console.log("social login callback request");
    if (intent === "register") {
      await socialLoginCallback({
        provider: provider as string,
        intent: intent as string,
        code: code as string,
      })
        .then((response) => {
          const callbackResponse = response;

          console.log({ callbackResponse });

          if (callbackResponse?.is_bound) {
            if (callbackResponse.token && callbackResponse.user) {
              //   setTokens(callbackResponse.token);
              toast.success("Social login successful");

              //   navigate({ to: "/profile" });
              return;
            }
          } else {
            if (callbackResponse?.social_user_info?.temp_token) {
              // TODO: handle for social login with temp token
              sessionStorage.setItem(
                "tempToken",
                callbackResponse.social_user_info.temp_token,
              );
              sessionStorage.setItem(
                "socialUserInfo",
                JSON.stringify(callbackResponse.social_user_info),
              );
              sessionStorage.setItem(
                "socialProvider",
                callbackResponse.social_user_info.provider,
              );

              navigate({
                to: "/social-signup",
              });
            } else {
              toast.error(t("auth.socialLogin.socialLoginFailed"));
              //   navigate({ to: "/profile" });
              return;
            }
          }
        })
        .catch((error) => {
          console.log("social login callback error", error);

          //   navigate({ to: "/profile" });
        });
    } else if (intent === "bind") {
      // TODO: handle for bind social account
    } else {
      toast.error("Invalid intent parameter");
      //   navigate({ to: "/profile" });
    }
  }, [code, provider, intent, socialLoginCallback]);

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      {isPending ? (
        <div>Processing social login...</div>
      ) : (
        <div>Redirecting...</div>
      )}
    </div>
  );
}
