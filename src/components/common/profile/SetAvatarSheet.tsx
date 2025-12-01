import SheetModal from "@/components/common/SheetModal";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

interface SetAvatarSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetAvatarSheet({ isOpen, onClose }: SetAvatarSheetProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTakePicture = () => {
    // TODO: Implement take picture functionality
    console.log("Take picture clicked");
    onClose();
  };

  const handleChooseFromGallery = () => {
    // TODO: Implement choose from gallery functionality
    console.log("Choose from gallery clicked");
    onClose();
  };

  const handleChoosePresetAvatar = () => {
    onClose();
    navigate({ to: "/profile/edit/preset-avatar" });
  };

  return (
    <SheetModal
      detent="content"
      showModal={isOpen}
      setShowModal={onClose}
      title={t("profile.edit.setAvatar")}
      onClose={onClose}
      containerClassName="!bg-dark-gray"
    >
      <div className="h-72 px-4 pt-4 pb-6">
        <div className="">
          <button
            onClick={handleTakePicture}
            className="hover:text-primary-blue w-full rounded-lg px-4 py-2 text-center text-white transition-colors"
          >
            <span className="text-base font-medium">
              {t("profile.edit.takePicture")}
            </span>
          </button>
          <hr className="my-2 border-white/10" />

          <button
            onClick={handleChooseFromGallery}
            className="hover:text-primary-blue w-full rounded-lg px-4 py-2 text-center text-white transition-colors"
          >
            <span className="text-base font-medium">
              {t("profile.edit.chooseFromGallery")}
            </span>
          </button>
          <hr className="my-2 border-white/10" />

          <button
            onClick={handleChoosePresetAvatar}
            className="hover:text-primary-blue w-full rounded-lg px-4 py-2 text-center text-white transition-colors"
          >
            <span className="text-base font-medium">
              {t("profile.edit.choosePresetAvatar")}
            </span>
          </button>
        </div>
      </div>
    </SheetModal>
  );
}
