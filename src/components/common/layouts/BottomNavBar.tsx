import { Link, useMatchRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import IconDownloadActive from "@/assets/svgs/icon-download-active.svg?react";
import IconDownloadInactive from "@/assets/svgs/icon-download-inactive.svg?react";
import IconExploreActive from "@/assets/svgs/icon-explore-active.svg?react";
import IconExploreInactive from "@/assets/svgs/icon-explore-inactive.svg?react";
import IconHomeActive from "@/assets/svgs/icon-home-active.svg?react";
import IconHomeInactive from "@/assets/svgs/icon-home-inactive.svg?react";
import IconProfileActive from "@/assets/svgs/icon-profile-active.svg?react";
import IconProfileInactive from "@/assets/svgs/icon-profile-inactive.svg?react";
import BottomNavbarSkeleton from "../skeletons/BottomNavbarSkeleton";

interface BottomNavbarProps {
  isLoading?: boolean;
}

function BottomNavbar({ isLoading = false }: BottomNavbarProps) {
  const { t } = useTranslation();

  const matchRoute = useMatchRoute();

  if (isLoading) {
    return <BottomNavbarSkeleton />;
  }

  const checkIsActive = (path: string) => {
    return matchRoute({ to: path });
  };
  const navItems = [
    {
      icon: {
        active: IconHomeActive,
        inactive: IconHomeInactive,
      },
      label: t("layout.navbar.home"),
      path: "/home",
    },
    {
      icon: {
        active: IconExploreActive,
        inactive: IconExploreInactive,
      },
      label: t("layout.navbar.explore"),
      path: "/explore",
    },
    {
      icon: {
        active: IconDownloadActive,
        inactive: IconDownloadInactive,
      },
      label: t("layout.navbar.download"),
      path: "/download",
    },
    {
      icon: {
        active: IconProfileActive,
        inactive: IconProfileInactive,
      },
      label: t("layout.navbar.profile"),
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 z-[var(--z-nav-layer)] h-[var(--bottom-nav-height)] w-screen max-w-md -translate-x-1/2 bg-gradient-to-t from-[#141416] to-[#1F1F1F] px-5 pt-2.5 pb-4">
      <div className="grid grid-cols-4 items-center gap-x-8">
        {navItems.map((item) => {
          const isActive = checkIsActive(item.path);

          return (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to={item.path}
                className="flex flex-col items-center gap-y-1"
              >
                <motion.div
                  initial={false}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {isActive ? (
                    <item.icon.active className="size-6" />
                  ) : (
                    <item.icon.inactive className="size-6" />
                  )}
                </motion.div>
                <motion.p
                  className="text-sm"
                  animate={{
                    color: isActive ? "#2496FF" : "#FFFFFF",
                    fontWeight: isActive ? 600 : 400,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNavbar;
