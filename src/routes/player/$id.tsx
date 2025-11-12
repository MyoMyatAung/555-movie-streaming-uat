import { MovieComment } from "@/components/common/movies/MovieComment";
import { MovieInfo } from "@/components/common/movies/MovieInfo";
import { MovieTab } from "@/components/common/movies/MovieTab";
import VideoPlayer from "@/components/common/VideoPlayer";
import {
  InfoLayer,
  WatermarkLayer,
} from "@/components/common/VideoPlayerLayers";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/player/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  // TODO: Fetch movie data based on id
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<"tab-1" | "tab-2">("tab-1");

  // For now, using demo HLS stream
  const videoUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  const posterUrl = "https://image.mux.com/x36xhzz/thumbnail.jpg";

  const tabComponents = new Map([
    ["tab-1", <MovieInfo key="info" />],
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
        layers={[
          {
            name: "info-layer",
            component: <InfoLayer title="Big Buck Bunny" episode="Episode 1" />,
          },
          {
            name: "watermark-layer",
            component: <WatermarkLayer text="555 Movie" />,
          },
        ]}
      />
      {/** Tab Bar */}
      <MovieTab activeTab={activeTab} setActiveTab={setActiveTab} />
      {/** Video Detail */}
      <>{tabComponents.get(activeTab)}</>
      {/** Video Actions */}
      {/** Related Videos */}
    </>
  );
}
