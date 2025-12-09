/**
 * UnauthenticatedHeader Component
 * 
 * Displays the profile header when user is not logged in.
 * Shows a placeholder avatar and login/signup prompt.
 * 
 * This component follows the Single Responsibility Principle by handling
 * only the unauthenticated user header display.
 * 
 * @example
 * ```tsx
 * <UnauthenticatedHeader onLoginClick={handleLogin} />
 * ```
 */

import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/assets/svgs/user-avatar.svg?react";

interface UnauthenticatedHeaderProps {
  /** Callback when user clicks login button */
  onLoginClick: () => void;
}

export const UnauthenticatedHeader = ({ onLoginClick }: UnauthenticatedHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Placeholder */}
      <div className="flex size-24 items-center justify-center rounded-full bg-white/10 shadow-[0_15px_45px_rgba(8,14,35,0.45)] backdrop-blur">
        <UserAvatar className="size-14 text-white/80" />
      </div>

      {/* Login/Signup Button */}
      <Button
        variant="link"
        className="group flex cursor-pointer items-center gap-2 text-lg font-medium text-white"
        onClick={onLoginClick}
      >
        <span className="underline underline-offset-4">
          {t("profile.loginOrSignup")}
        </span>
        <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

