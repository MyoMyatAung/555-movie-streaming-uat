/**
 * AuthenticatedHeader Component
 * 
 * Displays the user profile header when user is logged in.
 * Shows avatar, name/nickname, email, and achievement badge.
 * Clicking navigates to profile edit page.
 * 
 * This component follows the Single Responsibility Principle by handling
 * only the authenticated user header display.
 * 
 * @example
 * ```tsx
 * <AuthenticatedHeader user={user} />
 * ```
 */

import { Link } from "@tanstack/react-router";
import { ChevronRight, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BADGE_CONFIG } from "@/constants/profile";
import type { User } from "@/types/auth";

interface AuthenticatedHeaderProps {
  /** Current authenticated user data */
  user: User | null;
}

export const AuthenticatedHeader = ({ user }: AuthenticatedHeaderProps) => {
  const BadgeIcon = BADGE_CONFIG.icon;

  return (
    <Link to="/profile/edit">
      <div className="glassmorphism-light flex items-center gap-4 rounded-xl p-2 transition-all hover:bg-white/5">
        {/* User Avatar */}
        <Avatar className="size-12">
          <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
          <AvatarFallback className="bg-gray-500">
            <UserRound className="size-6 text-white" />
          </AvatarFallback>
        </Avatar>

        {/* User Info Section */}
        <div className="flex-1 space-y-2">
          {/* Name and Badge Row */}
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2">
              <span className="text-lg font-medium">
                {user?.nickname || user?.name}
              </span>
              <ChevronRight className="size-4 text-white" />
            </p>

            {/* Achievement Badge */}
            <span className="flex items-center gap-2 rounded-full bg-white/20 py-0 pr-2">
              <BadgeIcon className="size-6 text-white/80" />
              <span className="text-xs font-medium">Level {BADGE_CONFIG.level}</span>
            </span>
          </div>

          {/* Email */}
          <p className="text-sm">{user?.email}</p>
        </div>
      </div>
    </Link>
  );
};

