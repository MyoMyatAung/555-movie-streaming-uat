import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, UserRound } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ChangeEmailSheet } from "@/components/common/profile/ChangeEmailSheet";
import { ChangeMobileSheet } from "@/components/common/profile/ChangeMobileSheet";
import { ChangePasswordSheet } from "@/components/common/profile/ChangePasswordSheet";
import { SetAvatarSheet } from "@/components/common/profile/SetAvatarSheet";
import { SetNicknameSheet } from "@/components/common/profile/SetNicknameSheet";
import { TitleHeader } from "@/components/common/TitleHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuth";

export const Route = createFileRoute("/profile/edit/")({
  component: RouteComponent,
});

// Helper function to mask email
function maskEmail(email: string): string {
  if (!email) return "";
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  const visibleChars = Math.min(3, localPart.length);
  const maskedChars = localPart.length - visibleChars;
  const masked = localPart.slice(0, visibleChars) + "*".repeat(maskedChars);

  return `${masked}@${domain}`;
}

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modalManager, setModalManager] = useState<{
    setAvatar: boolean;
    setNickname: boolean;
    changeEmail: boolean;
    changeMobile: boolean;
    changePassword: boolean;
  }>({
    setAvatar: false,
    setNickname: false,
    changeEmail: false,
    changeMobile: false,
    changePassword: false,
  });

  const maskedEmail = user?.email ? maskEmail(user.email) : "";
  const hasPhone = user?.phone && user.phone.trim() !== "";

  return (
    <section className="flex min-h-svh flex-col gap-4 p-4 py-10">
      <TitleHeader
        title={t("profile.edit.editProfile")}
        onClose={() => navigate({ to: "/profile" })}
      />

      <div className="flex flex-col gap-4">
        {/* Profile Information Card */}
        <div className="glassmorphism-light rounded-xl p-4">
          <div className="space-y-4">
            {/* Set Avatar */}
            <button
              className="flex w-full items-center justify-between"
              onClick={() =>
                setModalManager({ ...modalManager, setAvatar: true })
              }
            >
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gray-500">
                      <UserRound className="size-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <UserRound className="size-5 text-white" />
                )}
                <span className="text-base font-medium text-white">
                  {t("profile.edit.setAvatar")}
                </span>
              </div>
              <ChevronRight className="size-5 text-white" />
            </button>

            {/* Nickname */}
            <button
              className="flex w-full items-center justify-between"
              onClick={() =>
                setModalManager({ ...modalManager, setNickname: true })
              }
            >
              <span className="text-base font-medium text-white">
                {t("profile.edit.nickname")}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/70">
                  {user?.nickname || user?.name || "Nora88"}
                </span>
                <ChevronRight className="size-5 text-white" />
              </div>
            </button>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="glassmorphism-light rounded-xl p-4">
          <div className="space-y-6">
            {/* Username */}
            <button
              className="flex w-full items-center justify-between"
              onClick={() => {
                // TODO: Implement username change
                console.log("Username clicked");
              }}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-base font-medium text-white">
                  {t("profile.username")}
                </span>
                <span className="text-xs text-white/60">
                  ({t("profile.edit.usernameCanBeUsedToLogin")})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/70">
                  {user?.name || ""}
                </span>
                <ChevronRight className="size-5 text-white" />
              </div>
            </button>

            {/* Change Email */}
            <button
              className="flex w-full items-center justify-between"
              onClick={() =>
                setModalManager({ ...modalManager, changeEmail: true })
              }
            >
              <span className="text-base font-medium text-white">
                {t("profile.settings.changeEmail")}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/70">
                  {maskedEmail || t("common.notSet")}
                </span>
                <ChevronRight className="size-5 text-white" />
              </div>
            </button>

            {/* Change Mobile Number */}
            <button
              className="flex w-full items-center justify-between"
              onClick={() =>
                setModalManager({ ...modalManager, changeMobile: true })
              }
            >
              <span className="text-base font-medium text-white">
                {t("profile.settings.changeMobile")}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/70">
                  {hasPhone ? user?.phone : t("common.notSet")}
                </span>
                <ChevronRight className="size-5 text-white" />
              </div>
            </button>

            {/* Social Bind */}
            <button
              className="flex w-full items-center justify-between"
              onClick={() => {
                // TODO: Implement social bind
                console.log("Social Bind clicked");
              }}
            >
              <span className="text-base font-medium text-white">
                {t("profile.edit.socialBind")}
              </span>
              <ChevronRight className="size-5 text-white" />
            </button>

            {/* Change Password */}
            <button
              className="flex w-full items-center justify-between"
              onClick={() =>
                setModalManager({ ...modalManager, changePassword: true })
              }
            >
              <span className="text-base font-medium text-white">
                {t("profile.settings.changePassword")}
              </span>
              <ChevronRight className="size-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Set Avatar Sheet */}
      <SetAvatarSheet
        isOpen={modalManager.setAvatar}
        onClose={() => setModalManager({ ...modalManager, setAvatar: false })}
      />

      {/* Set Nickname Sheet */}
      <SetNicknameSheet
        isOpen={modalManager.setNickname}
        onClose={() => setModalManager({ ...modalManager, setNickname: false })}
        currentNickname={user?.nickname || ""}
      />

      {/* Change Email Sheet */}
      <ChangeEmailSheet
        isOpen={modalManager.changeEmail}
        onClose={() => setModalManager({ ...modalManager, changeEmail: false })}
        currentEmail={user?.email || ""}
      />

      {/* Change Mobile Sheet */}
      <ChangeMobileSheet
        isOpen={modalManager.changeMobile}
        onClose={() =>
          setModalManager({ ...modalManager, changeMobile: false })
        }
        currentPhone={user?.phone || ""}
      />

      {/* Change Password Sheet */}
      <ChangePasswordSheet
        isOpen={modalManager.changePassword}
        onClose={() =>
          setModalManager({ ...modalManager, changePassword: false })
        }
      />
    </section>
  );
}
