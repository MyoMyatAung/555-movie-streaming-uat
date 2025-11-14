import Download from "@/assets/svgs/download.svg?react";
import HeartActive from "@/assets/svgs/heart-active.svg?react";
import Message from "@/assets/svgs/message-text.svg?react";
import Share from "@/assets/svgs/share.svg?react";
import Star from "@/assets/svgs/star.svg?react";

import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { MoreMovie } from "./MoreMovie";
import { SelectEpisode } from "./SelectEpisode";

interface MovieInfoProps {
  setOpenDownloadSheet: Dispatch<SetStateAction<boolean>>;
  setOpenFeedbackSheet: Dispatch<SetStateAction<boolean>>;
}

export function MovieInfo({
  setOpenDownloadSheet,
  setOpenFeedbackSheet,
}: MovieInfoProps) {
  const { t } = useTranslation();

  const handleClickDownload = () => {
    setOpenDownloadSheet(true);
  };

  const handleClickFeedback = () => {
    setOpenFeedbackSheet(true);
  };

  return (
    <div className="overflow-y-auto p-2">
      <h1 className="text-white">Moana (2016)</h1>
      <div className="flex w-fit items-start divide-x divide-solid divide-gray-400 text-white">
        <div className="w-fit pr-2">2016</div>
        <div className="flex w-fit items-center gap-1 px-2">
          <Star /> <span>6.8/10</span>
        </div>
        <div className="w-fit px-2">2hr 48mins</div>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white inset-shadow-sm backdrop-blur-md">
          Action
        </button>
        <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white inset-shadow-sm backdrop-blur-md">
          Fantasy
        </button>
        <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white inset-shadow-sm backdrop-blur-md">
          Animation
        </button>
        <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white inset-shadow-sm backdrop-blur-md">
          Disney
        </button>
      </div>
      <p className="mt-4 line-clamp-3 text-white">
        Moana is a 2016 American animated musical fantasy adventure film
        produced by Walt Disney Animation Studios and released by Walt Disney
        Pictures. It is the 56th Disney animated feature film. The film tells
        the story of Moana, a Polynesian girl who sets sail on a daring mission
        to save her people. During her journey, Moana meets the demigod Maui,
        voiced by Dwayne Johnson, and together they face challenges to restore
        the heart of Te Fiti.
      </p>
      <button className="mt-2 text-blue-400">Read more</button>
      <div className="mt-4 flex justify-between gap-4">
        <button
          onClick={handleClickDownload}
          className="flex flex-col items-center gap-2 text-white"
        >
          <Download /> {t("movie-detail.actions.download")}
        </button>
        <button className="flex flex-col items-center gap-2 text-white">
          <HeartActive /> {t("movie-detail.actions.bookmark")}
        </button>
        <button
          onClick={handleClickFeedback}
          className="flex flex-col items-center gap-2 text-white"
        >
          <Message /> {t("movie-detail.actions.feedback")}
        </button>
        <button className="flex flex-col items-center gap-2 text-white">
          <Share /> {t("movie-detail.actions.share")}
        </button>
      </div>
      <SelectEpisode />
      <MoreMovie />
    </div>
  );
}
