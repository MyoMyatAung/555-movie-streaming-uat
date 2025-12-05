import Download from "@/assets/svgs/download.svg?react";
import HeartActive from "@/assets/svgs/heart-active.svg?react";
import Message from "@/assets/svgs/message-text.svg?react";
import Share from "@/assets/svgs/share.svg?react";
import Star from "@/assets/svgs/star.svg?react";

import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { MoreMovie } from "./MoreMovie";
import { SelectEpisode } from "./SelectEpisode";
import type { PostDetail } from "@/types/movie-detail";
import { useState } from "react";

interface MovieInfoProps {
  postDetail: PostDetail;
  setOpenDownloadSheet: Dispatch<SetStateAction<boolean>>;
  setOpenFeedbackSheet: Dispatch<SetStateAction<boolean>>;
}

export function MovieInfo({
  postDetail,
  setOpenDownloadSheet,
  setOpenFeedbackSheet,
}: MovieInfoProps) {
  const { t } = useTranslation();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleClickDownload = () => {
    setOpenDownloadSheet(true);
  };

  const handleClickFeedback = () => {
    setOpenFeedbackSheet(true);
  };

  // Format duration from seconds to readable format
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}hr ${minutes}min`;
    }
    return `${minutes}min`;
  };

  // Get duration from the first video file
  const videoDuration = postDetail.files.find(f => f.type === "video")?.duration;
  const durationText = videoDuration ? formatDuration(videoDuration) : null;

  return (
    <div className="overflow-y-auto p-2">
      <h1 className="text-white">{postDetail.title}</h1>
      <div className="flex w-fit items-start divide-x divide-solid divide-gray-400 text-white">
        <div className="w-fit pr-2">{postDetail.year}</div>
        {(postDetail.rating > 0 || postDetail.score > 0) && (
          <div className="flex w-fit items-center gap-1 px-2">
            <Star /> <span>{(postDetail.rating || postDetail.score).toFixed(1)}/10</span>
          </div>
        )}
        {durationText && (
          <div className="w-fit px-2">{durationText}</div>
        )}
      </div>
      {postDetail.tag && postDetail.tag.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {postDetail.tag.map((tag, index) => (
            <button
              key={index}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white inset-shadow-sm backdrop-blur-md"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      {postDetail.description && (
        <>
          <p className={`mt-4 text-white ${showFullDescription ? "" : "line-clamp-3"}`}>
            {postDetail.description}
          </p>
          {postDetail.description.length > 150 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 text-blue-400"
            >
              {showFullDescription ? "Show less" : "Read more"}
            </button>
          )}
        </>
      )}
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
      {postDetail.episodes && postDetail.episodes > 0 ? null : (
        <div className="mt-6">
          <h2 className="mb-4 text-lg font-semibold text-white">More Like This</h2>
          <MoreMovie postId={postDetail.post_id} />
        </div>
      )}
    </div>
  );
}
