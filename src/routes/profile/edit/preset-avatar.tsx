import { useGetAvatarList, useSetAvatar } from "@/apis/avatar";
import { FullScreenLoading } from "@/components/common/FullscreenLoading";
import { TitleHeader } from "@/components/common/TitleHeader";
import { DecryptedImage } from "@/components/common/images/DecryptedImage";
import { ConfirmDialog } from "@/components/common/ui/ConfirmDialog";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ImageOff, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/edit/preset-avatar")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { avatars: avatarLists, isLoading } = useGetAvatarList();
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(
    user?.avatar_id || null,
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [requiredLevel, setRequiredLevel] = useState<number>(0);

  // Get all avatars from all lists
  const allAvatars = useMemo(() => {
    return avatarLists.flatMap((avatarList) => avatarList.list || []);
  }, [avatarLists]);

  const { mutateAsync: setAvatar, isPending: isSaving } = useSetAvatar({
    onSuccess: (response) => {
      console.log({ response });
      if (response?.status) {
        // Update user avatar in store
        if (selectedAvatarId) {
          const selectedAvatar = allAvatars.find(
            (avatar) => avatar.id === selectedAvatarId,
          );
          if (selectedAvatar) {
            updateUser({ avatar: selectedAvatar.image });
          }
        }
        toast.success(
          t("profile.edit.avatarUpdatedSuccessfully") ||
            "Avatar updated successfully",
        );
        // Invalidate user profile query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        setShowConfirmDialog(false);
        navigate({ to: "/profile/edit" });
      } else {
        toast.error(
          response?.message ||
            t("profile.edit.failedToUpdateAvatar") ||
            "Failed to update avatar",
        );
      }
    },
    onError: (error) => {
      console.error("Error setting avatar:", error);
      toast.error(
        error?.message ||
          t("profile.edit.failedToUpdateAvatar") ||
          "Failed to update avatar",
      );
    },
  });

  // Get selected avatar
  const selectedAvatar = useMemo(() => {
    return allAvatars.find((avatar) => avatar.id === selectedAvatarId);
  }, [allAvatars, selectedAvatarId]);

  const handleAvatarClick = (
    avatar: (typeof allAvatars)[0],
    isAvailable: boolean,
  ) => {
    if (isAvailable) {
      setSelectedAvatarId(avatar.id);
    } else {
      setRequiredLevel(avatar.level_id);
      setShowUnlockDialog(true);
    }
  };

  const handleSave = () => {
    if (selectedAvatarId) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmSave = async () => {
    if (!selectedAvatarId) return;

    try {
      setShowConfirmDialog(false);
      await setAvatar({ avatar_id: selectedAvatarId });
    } catch (error) {
      // Error is handled in the mutation's onError callback
      console.error("Failed to save avatar:", error);
    }
  };

  const handleUnlock = () => {
    // TODO: Implement unlock level functionality
    console.log("Unlock level:", requiredLevel);
    setShowUnlockDialog(false);
  };

  if (isLoading) {
    return (
      <section className="flex min-h-svh flex-col gap-4 p-4 py-10">
        <TitleHeader
          title={t("profile.edit.presetAvatar")}
          onClose={() => navigate({ to: "/profile/edit" })}
        />
        <FullScreenLoading isVisible={isLoading} />
      </section>
    );
  }

  return (
    <section className="flex min-h-svh flex-col gap-4 p-4 py-6">
      <TitleHeader
        title={t("profile.edit.presetAvatar")}
        onClose={() => navigate({ to: "/profile/edit" })}
      >
        <Button
          variant="link"
          onClick={handleSave}
          disabled={!selectedAvatarId || isSaving}
          className="text-primary-blue px-0 text-sm font-medium hover:no-underline disabled:opacity-50"
        >
          {isSaving
            ? t("common.loading") || "Saving..."
            : t("profile.edit.save")}
        </Button>
      </TitleHeader>

      {/* Current Avatar Display */}
      <div className="flex justify-center pb-5">
        <div className="size-32 overflow-hidden rounded-full border-4 border-white/20">
          {selectedAvatar?.image ? (
            <DecryptedImage
              src={selectedAvatar.image}
              alt={selectedAvatar.name}
              width="100%"
              height="100%"
              objectFit="cover"
              loading="eager"
              className="rounded-full"
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-gray-500">
                  <UserRound className="size-16 text-white" />
                </div>
              }
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-500">
              <UserRound className="size-16 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Avatar Grid by Level */}
      <div className="flex-1 overflow-y-auto">
        {avatarLists.map((avatarList) => {
          const canSelect = avatarList.is_available;
          return (
            <div key={avatarList.level} className="mb-8 px-2">
              <h3 className="mb-4 text-lg font-semibold text-white">
                {avatarList.level}
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {avatarList.list?.map((avatar) => {
                  const isSelected = selectedAvatarId === avatar.id;

                  return (
                    <button
                      key={avatar.id}
                      onClick={() => handleAvatarClick(avatar, canSelect)}
                      disabled={!canSelect}
                      className={cn(
                        "relative aspect-square overflow-hidden rounded-lg transition-all",
                        isSelected
                          ? "ring-primary-blue ring-4"
                          : "ring-2 ring-transparent",
                        canSelect ? "opacity-100" : "opacity-50",
                        canSelect && !isSelected
                          ? "hover:ring-white/30"
                          : "hover:ring-primary-blue",
                      )}
                    >
                      <DecryptedImage
                        src={avatar.image}
                        alt={avatar.name}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        className="rounded-lg"
                        fallback={
                          <div className="flex h-full w-full items-center justify-center bg-gray-300">
                            <ImageOff className="size-6 text-gray-500" />
                          </div>
                        }
                      />
                      {!canSelect && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={t("profile.edit.setAvatar")}
        message={t("profile.edit.setAvatarConfirmation")}
        confirmText={t("profile.edit.confirm")}
        cancelText={t("profile.settings.goBack")}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmDialog(false)}
      />

      {/* Unlock Level Dialog */}
      <ConfirmDialog
        isOpen={showUnlockDialog}
        title={t("profile.edit.setAvatar")}
        message={t("profile.edit.unlockLevelRequired", {
          level: requiredLevel,
        })}
        confirmText={t("profile.edit.unlockLevel", { level: requiredLevel })}
        cancelText={t("profile.settings.goBack")}
        onConfirm={handleUnlock}
        onCancel={() => setShowUnlockDialog(false)}
      />
    </section>
  );
}
