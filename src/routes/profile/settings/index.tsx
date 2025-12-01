import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TitleHeader } from "@/components/common/TitleHeader";
import { ConfirmDialog } from "@/components/common/ui/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import useAuth from "@/hooks/useAuth";

export const Route = createFileRoute("/profile/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [teenMode, setTeenMode] = useState(false);
  const [pictureInPictureMode, setPictureInPictureMode] = useState(true);
  const [allowDownloadWithoutWiFi, setAllowDownloadWithoutWiFi] =
    useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const settings = [
    {
      label: t("profile.settings.notifications"),
      value: notifications,
      onChange: setNotifications,
    },
    {
      label: t("profile.settings.teenMode"),
      value: teenMode,
      onChange: setTeenMode,
    },
    {
      label: t("profile.settings.pictureInPictureMode"),
      value: pictureInPictureMode,
      onChange: setPictureInPictureMode,
    },
    {
      label: t("profile.settings.allowDownloadWithoutWiFi"),
      value: allowDownloadWithoutWiFi,
      onChange: setAllowDownloadWithoutWiFi,
    },
  ];

  return (
    <section className="flex h-svh flex-col justify-between gap-4 p-4 py-10">
      <div className="">
        <TitleHeader
          title={t("profile.settings.title")}
          onClose={() => navigate({ to: "/profile" })}
        />

        <div className="glassmorphism-light mt-6 rounded-xl bg-white/2 p-4">
          <div className="space-y-6">
            {settings.map((setting) => (
              <div
                key={setting.label}
                className="flex items-center justify-between"
              >
                <span className="text-base font-medium text-white">
                  {setting.label}
                </span>
                <Switch
                  checked={setting.value}
                  onCheckedChange={setting.onChange}
                />
              </div>
            ))}

            <div className="border-t border-white/10 pt-6">
              <button
                type="button"
                className="flex w-full items-center justify-between"
                onClick={() => {
                  // Handle version click
                }}
              >
                <span className="text-base font-medium text-white">
                  {t("profile.settings.currentVersion")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">V 1.0.0.0</span>
                  <ChevronRight className="size-5 text-white" />
                </div>
              </button>
            </div>

            <div className="border-t border-white/10 pt-6">
              <button
                type="button"
                className="flex w-full items-center justify-between"
                onClick={() => {
                  // Handle clear cache click
                }}
              >
                <span className="text-base font-medium text-white">
                  {t("profile.settings.clearCache")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">24MB</span>
                  <ChevronRight className="size-5 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        className="h-10 w-full rounded-full border-white/20 bg-transparent text-lg font-medium text-white hover:bg-white/10 hover:text-white"
        onClick={() => setShowLogoutDialog(true)}
      >
        <LogOutIcon className="size-5 text-white" />
        {t("profile.settings.logout")}
      </Button>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        message={t("profile.settings.logoutConfirmation")}
        confirmText={t("profile.settings.logout")}
        cancelText={t("profile.settings.goBack")}
        onConfirm={() => {
          logout();
          navigate({ to: "/profile" });
        }}
        onCancel={() => setShowLogoutDialog(false)}
        cancelButtonClassName="text-sm"
        confirmButtonClassName="text-sm text-rose-500 hover:text-rose-600"
      />
    </section>
  );
}
