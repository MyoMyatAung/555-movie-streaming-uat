import AchievementBadge from "@/assets/svgs/achievement.svg?react";
import CollectionIcon from "@/assets/svgs/collection.svg?react";
import IconInvitation from "@/assets/svgs/icon-invitation.svg?react";
import IconNotification from "@/assets/svgs/icon-notification.svg?react";
import IconSettingsFill from "@/assets/svgs/icon-settings-fill.svg?react";
import SmileSquareIcon from "@/assets/svgs/smile-square.svg?react";
import UserAvatar from "@/assets/svgs/user-avatar.svg?react";
import UserInvitationIcon from "@/assets/svgs/user-invitation.svg?react";
import VideoIcon from "@/assets/svgs/video-play.svg?react";
import ForgotPassword from "@/components/common/auth/ForgotPassword";
import { LoginForm } from "@/components/common/auth/LoginForm";
import RegisterForm from "@/components/common/auth/RegisterForm";
import HomeLayout from "@/components/common/layouts/HomeLayout";
import SheetModal from "@/components/common/SheetModal";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUp,
  ChevronRight,
  Download,
  MessageSquareMore,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();

  const [showModal, setShowModal] = useState({
    language: false,
    share: false,
    login: false,
    signup: false,
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { setRecaptchaToken } = useAuthStore();

  const quickActions = [
    {
      label: t("profile.quickActions.notifications"),
      icon: IconNotification,
      gradient:
        "bg-[linear-gradient(180deg,rgba(168,82,255,0.2)_0%,rgba(74,177,255,0.2)_100%)]",
    },
    {
      label: t("profile.quickActions.invitation"),
      icon: IconInvitation,
      gradient:
        "bg-[linear-gradient(180deg,rgba(248,89,8,0.2)_0%,rgba(255,205,174,0.2)_56.73%)]",
    },
    {
      label: t("profile.quickActions.settings"),
      icon: IconSettingsFill,
      gradient:
        "bg-[linear-gradient(360deg,rgba(255,139,82,0.2)_0%,rgba(208,255,0,0.2)_100%)]",
      to: "/profile/settings",
    },
    {
      label: t("profile.quickActions.update"),
      icon: ArrowUp,
      gradient:
        "bg-[linear-gradient(90deg,rgba(82,255,108,0.2)_0%,rgba(71,255,55,0.2)_100%)]",
    },
  ];

  const watchlistLinks = [
    {
      label: t("profile.watchlistLinks.continueWatching"),
      icon: VideoIcon,
    },
    {
      label: t("profile.watchlistLinks.watchlist"),
      icon: CollectionIcon,
    },
    {
      label: t("profile.watchlistLinks.history"),
      icon: Download,
    },
  ];

  const supportLinks = [
    {
      label: t("profile.supportLinks.invitationCode"),
      icon: UserInvitationIcon,
      value: "80880",
    },
    {
      label: t("profile.supportLinks.shareOurApp"),
      icon: Share2,
    },
    {
      label: t("profile.supportLinks.feedbacks"),
      icon: SmileSquareIcon,
    },
    {
      label: t("profile.supportLinks.contactUs"),
      icon: MessageSquareMore,
    },
  ];

  return (
    <HomeLayout noHeader={true}>
      <div className="relative h-full">
        <div className="flex h-full flex-col px-6 pt-8 pb-10 text-white">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 rounded-xl border border-white/20 p-2 backdrop-blur-xl">
              <UserAvatar className="size-12 text-white/80" />
              <div className="flex-1 space-y-2">
                <p className="flex items-center justify-between gap-2">
                  <span className="text-lg font-medium">{user?.name}</span>
                  <span className="flex items-center gap-2 rounded-full bg-white/20 py-0 pr-2">
                    <AchievementBadge className="size-6 text-white/80" />
                    <span className="text-xs font-medium">Level 4</span>
                  </span>
                </p>
                <p className="text-sm">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-24 items-center justify-center rounded-full bg-white/10 shadow-[0_15px_45px_rgba(8,14,35,0.45)] backdrop-blur">
                <UserAvatar className="size-14 text-white/80" />
              </div>
              <Button
                variant="link"
                className="group flex cursor-pointer items-center gap-2 text-lg font-medium text-white"
                onClick={() =>
                  setShowModal((prev) => ({ ...prev, login: true }))
                }
              >
                <span className="underline underline-offset-4">
                  {t("profile.loginOrSignup")}
                </span>
                <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </div>
          )}

          <div className="mt-8 grid grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                to={action.to || ""}
                key={action.label}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl bg-linear-to-br ${action.gradient} shadow-[0_12px_32px_rgba(10,16,32,0.45)] transition-transform duration-200 group-hover:-translate-y-1`}
                >
                  <action.icon
                    className={cn(
                      "size-8 text-white",
                      action.label === "Settings" && "size-6",
                    )}
                  />
                </div>
                <span className="text-xs font-medium text-white/80">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-6">
            <div className="rounded-xl border border-white/20 bg-transparent p-4 shadow-[0_25px_50px_rgba(5,10,25,0.45)] backdrop-blur-xl">
              <div className="space-y-6">
                {watchlistLinks.map((item) => (
                  <div key={item.label}>
                    <button className="flex w-full items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-2xl">
                          <item.icon className="size-6 text-white" />
                        </div>
                        <span className="text-base font-medium">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight className="size-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/20 bg-transparent p-4 shadow-[0_25px_50px_rgba(5,10,25,0.45)] backdrop-blur-xl">
              <div className="space-y-6">
                {supportLinks.map((item) => (
                  <div key={item.label}>
                    <button className="flex w-full items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-2xl">
                          <item.icon className="size-6 text-white" />
                        </div>
                        <span className="text-base font-medium">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.value ? (
                          <span className="text-sm text-white/70">
                            {item.value}
                          </span>
                        ) : null}
                        <ChevronRight className="size-5 text-white" />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {isAuthenticated && (
              <Button className="w-full" variant="destructive" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>

      <SheetModal
        detent="content"
        showModal={showModal.login}
        setShowModal={(value) => {
          if (!value) {
            setRecaptchaToken(null);
          }
          setShowModal((prev) => ({ ...prev, login: value }));
        }}
        containerClassName="!bg-dark-gray"
      >
        {showForgotPassword ? (
          <ForgotPassword
            onClose={() => setShowForgotPassword(false)}
            onLogin={() => {
              setShowForgotPassword(false);
            }}
          />
        ) : (
          <LoginForm
            onClose={() => setShowModal((prev) => ({ ...prev, login: false }))}
            onForgotPassword={() => {
              setShowForgotPassword(true);
            }}
            onSignUp={() => {
              setShowModal((prev) => ({ ...prev, login: false, signup: true }));
            }}
          />
        )}
      </SheetModal>

      <SheetModal
        detent="content"
        key={"signup"}
        showModal={showModal.signup}
        setShowModal={(value) => {
          if (!value) {
            setRecaptchaToken(null);
          }
          setShowModal((prev) => ({ ...prev, signup: value }));
        }}
        snapPoints={[0, 1]}
        containerClassName="bg-dark-gray! overflow-y-auto"
      >
        {showModal.signup && (
          <RegisterForm
            onSignIn={() => {
              setShowModal((prev) => ({ ...prev, login: true, signup: false }));
            }}
            onBack={() => {
              setShowModal((prev) => ({ ...prev, login: true, signup: false }));
            }}
            onClose={() => setShowModal((prev) => ({ ...prev, signup: false }))}
          />
        )}
      </SheetModal>
    </HomeLayout>
  );
}
