import BulletComment from "@/assets/svgs/bulletscreens.svg?react";
import ActiveBulletComment from "@/assets/svgs/icon-bulletactive.svg?react";
import { useTranslation } from "react-i18next";

interface MovieTabProps {
  activeTab: "tab-1" | "tab-2";
  setActiveTab: React.Dispatch<React.SetStateAction<"tab-1" | "tab-2">>;
  activeBulletComment: boolean;
  setActiveBulletComment: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MovieTab({
  activeTab,
  setActiveTab,
  activeBulletComment,
  setActiveBulletComment,
}: MovieTabProps) {
  const { t } = useTranslation();

  const handleToggleBulletComment = () => {
    setActiveBulletComment((prev) => !prev);
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex">
        <div
          className={`relative cursor-pointer px-4 py-3 text-gray-400 ${
            activeTab === "tab-1" ? "z-10 text-white" : ""
          }`}
          onClick={() => setActiveTab("tab-1")}
        >
          <span className="text-[16px] text-white">
            {t("movie-detail.info.title")}
          </span>
          {activeTab === "tab-1" && (
            <div className="bg-primary-blue absolute bottom-0 left-5 h-1 w-4 rounded-md"></div>
          )}
        </div>
        <div
          className={`relative cursor-pointer px-4 py-3 text-gray-400 ${
            activeTab === "tab-2" ? "z-10 text-white" : ""
          }`}
          onClick={() => setActiveTab("tab-2")}
        >
          <span className="text-[16px]">
            {t("movie-detail.comments.title")} 2113
          </span>
          <span className="ml-1.5 text-sm text-gray-500"></span>
          {activeTab === "tab-2" && (
            <div className="bg-primary-blue absolute bottom-0 left-10 h-1 w-4 rounded-md"></div>
          )}
        </div>
      </div>
      <button
        onClick={handleToggleBulletComment}
        className="mr-2 flex cursor-pointer items-center gap-2"
      >
        <span className="text-sm text-white">
          {t("movie-detail.comments.bullet")}
        </span>
        {activeBulletComment ? <ActiveBulletComment /> : <BulletComment />}
      </button>
    </div>
  );
}
