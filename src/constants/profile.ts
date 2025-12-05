/**
 * Profile page configuration constants
 * Centralized configuration makes it easier to maintain and update
 */

import AchievementBadge from "@/assets/svgs/achievement.svg?react";
import CollectionIcon from "@/assets/svgs/collection.svg?react";
import IconInvitation from "@/assets/svgs/icon-invitation.svg?react";
import IconNotification from "@/assets/svgs/icon-notification.svg?react";
import IconSettingsFill from "@/assets/svgs/icon-settings-fill.svg?react";
import SmileSquareIcon from "@/assets/svgs/smile-square.svg?react";
import UserInvitationIcon from "@/assets/svgs/user-invitation.svg?react";
import VideoIcon from "@/assets/svgs/video-play.svg?react";
import { ArrowUp, Download, MessageSquareMore, Share2 } from "lucide-react";
import type { QuickAction, ListItemConfig } from "@/types/profile-ui";

/**
 * Quick action buttons configuration
 * These appear in the grid below the profile header
 */
export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "profile.quickActions.notifications",
    icon: IconNotification,
    gradient:
      "bg-[linear-gradient(180deg,rgba(168,82,255,0.2)_0%,rgba(74,177,255,0.2)_100%)]",
  },
  {
    label: "profile.quickActions.invitation",
    icon: IconInvitation,
    gradient:
      "bg-[linear-gradient(180deg,rgba(248,89,8,0.2)_0%,rgba(255,205,174,0.2)_56.73%)]",
  },
  {
    label: "profile.quickActions.settings",
    icon: IconSettingsFill,
    gradient:
      "bg-[linear-gradient(360deg,rgba(255,139,82,0.2)_0%,rgba(208,255,0,0.2)_100%)]",
    to: "/profile/settings",
  },
  {
    label: "profile.quickActions.update",
    icon: ArrowUp,
    gradient:
      "bg-[linear-gradient(90deg,rgba(82,255,108,0.2)_0%,rgba(71,255,55,0.2)_100%)]",
  },
];

/**
 * Watchlist section links configuration
 * These appear in the first card section
 */
export const WATCHLIST_LINKS: ListItemConfig[] = [
  {
    label: "profile.watchlistLinks.continueWatching",
    icon: VideoIcon,
  },
  {
    label: "profile.watchlistLinks.myCollection",
    icon: CollectionIcon,
    to: "/profile/collection",
  },
  {
    label: "profile.watchlistLinks.history",
    icon: Download,
  },
];

/**
 * Support section links configuration
 * These appear in the second card section
 */
export const SUPPORT_LINKS: ListItemConfig[] = [
  {
    label: "profile.supportLinks.invitationCode",
    icon: UserInvitationIcon,
    value: "80880",
  },
  {
    label: "profile.supportLinks.shareOurApp",
    icon: Share2,
  },
  {
    label: "profile.supportLinks.feedbacks",
    icon: SmileSquareIcon,
  },
  {
    label: "profile.supportLinks.contactUs",
    icon: MessageSquareMore,
  },
];

/**
 * Badge configuration
 */
export const BADGE_CONFIG = {
  icon: AchievementBadge,
  level: 4,
};

