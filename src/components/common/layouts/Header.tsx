import { BellIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import HeaderSkeleton from "../skeletons/HeaderSkeleton";

interface HeaderProps {
  isLoading?: boolean;
}

function Header({ isLoading = false }: HeaderProps) {
  const [hasNotifications] = useState(true); // This would come from your notification state
  const { t } = useTranslation();

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="w-full px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Avatar and Welcome */}
        <div className="flex flex-1 items-center gap-3">
          {/* Avatar with Pikachu */}
          <div className="relative">
            <div className="relative flex size-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-pink-400 via-purple-500 to-purple-700">
              {/* Lightning bolt background */}
              <svg
                className="absolute inset-0 h-full w-full opacity-30"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path d="M50 10L70 50H55L60 90L30 50H45L50 10Z" fill="white" />
              </svg>
              {/* Pikachu */}
              <div className="relative size-12 overflow-hidden rounded-full border border-white">
                <img
                  src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
                  alt="Pikachu"
                  width={48}
                  height={48}
                />
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="flex flex-col">
            <span className="text-sm font-normal text-white">
              {t("pages.home.welcomeBack")},
            </span>
            <span className="text-base font-semibold text-white">
              Krystina Jenny
            </span>
          </div>
        </div>

        {/* Right: Search and Notifications */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            className="h-auto rounded-2xl bg-white/5 px-4 py-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:bg-white/10"
          >
            <SearchIcon className="mr-2 size-5 text-white" />
            <span className="text-sm text-white">{t("pages.home.search")}</span>
          </Button>

          {/* Notification Bell */}
          <Button
            variant="ghost"
            className="relative rounded-full bg-white/5 p-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] hover:bg-white/10"
          >
            <BellIcon className="size-5 text-white" />
            {hasNotifications && (
              <div className="absolute top-1 right-1 size-2 rounded-full border border-white bg-blue-500" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
