import { MovieComment } from "@/components/common/movies/MovieComment";
import { MovieDownloadSheet } from "@/components/common/movies/MovieDownloadSheet";
import { MovieFeedbackSheet } from "@/components/common/movies/MovieFeedbackSheet";
import { MovieInfo } from "@/components/common/movies/MovieInfo";
import { MovieTab } from "@/components/common/movies/MovieTab";
import VideoPlayer from "@/components/common/VideoPlayer";
import { BulletCommentLayer } from "@/components/common/VideoPlayerLayers";
import { mockComments } from "@/data/mockComments";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/player/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  // TODO: Fetch movie data based on id
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<"tab-1" | "tab-2">("tab-1");
  const [openDownloadSheet, setOpenDownloadSheet] = useState(false);
  const [openFeedbackSheet, setOpenFeedbackSheet] = useState(false);
  const [activeBulletComment, setActiveBulletComment] = useState(false);

  // For now, using demo HLS stream
  const videoUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  // const videoUrl = "http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8";
  // const videoUrl = "http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8";
  // const videoUrl = "http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8";
  // const videoUrl = "https://test-streams.mux.dev/test_001/stream.m3u8";
  // const videoUrl = "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8";
  // const videoUrl = "https://test-streams.mux.dev/issue666/playlists/cisq0gim60007xzvi505emlxx.m3u8";
  // const videoUrl = "https://test-streams.mux.dev/pts_shift/master.m3u8";
  // const videoUrl = "https://test-streams.mux.dev/tos_ismc/main.m3u8";
  const posterUrl = "https://image.mux.com/x36xhzz/thumbnail.jpg";

  // Memoize layers to prevent VideoPlayer from restarting
  const videoLayers = useMemo(
    () => [
      ...(activeBulletComment
        ? [
            {
              name: "bullet-comment-layer",
              component: <BulletCommentLayer comments={mockComments} />,
            },
          ]
        : []),
    ],
    [activeBulletComment],
  );

  const tabComponents = new Map([
    [
      "tab-1",
      <MovieInfo
        setOpenFeedbackSheet={setOpenFeedbackSheet}
        setOpenDownloadSheet={setOpenDownloadSheet}
        key="info"
      />,
    ],
    ["tab-2", <MovieComment key="comment" />],
  ]);
  return (
    <>
      {/* Video Player Content */}
      <VideoPlayer
        url={videoUrl}
        poster={posterUrl}
        autoplay={false}
        muted={false}
        layers={videoLayers}
      />
      <MovieTab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeBulletComment={activeBulletComment}
        setActiveBulletComment={setActiveBulletComment}
      />
      <>{tabComponents.get(activeTab)}</>
      <MovieDownloadSheet
        openDownloadSheet={openDownloadSheet}
        setOpenDownloadSheet={setOpenDownloadSheet}
      />
      <MovieFeedbackSheet
        openFeedbackSheet={openFeedbackSheet}
        setOpenFeedbackSheet={setOpenFeedbackSheet}
      />
    </>
  );
}
