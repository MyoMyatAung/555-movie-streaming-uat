// Example: How to use layers with VideoPlayer component

import VideoPlayer from "@/components/common/VideoPlayer";
import {
  CustomControlLayer,
  InfoLayer,
  LoadingLayer,
  WatermarkLayer,
} from "@/components/common/VideoPlayerLayers";
import { useState } from "react";

export function VideoPlayerExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    console.log("Next episode");
  };

  const handlePrevious = () => {
    console.log("Previous episode");
  };

  return (
    <div>
      <h2>Example 1: Simple Watermark</h2>
      <VideoPlayer
        url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        layers={[
          {
            name: "watermark",
            component: <WatermarkLayer text="My Platform" />,
          },
        ]}
      />

      <h2>Example 2: Info Layer with Title and Episode</h2>
      <VideoPlayer
        url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        layers={[
          {
            name: "info",
            component: (
              <InfoLayer title="The Great Movie" episode="Season 1, Episode 5" />
            ),
          },
        ]}
      />

      <h2>Example 3: Multiple Layers</h2>
      <VideoPlayer
        url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        layers={[
          {
            name: "info",
            component: <InfoLayer title="Amazing Series" episode="S2 E3" />,
          },
          {
            name: "watermark",
            component: <WatermarkLayer text="© 2024" />,
          },
          {
            name: "loading",
            component: <LoadingLayer isLoading={isLoading} />,
          },
        ]}
      />

      <h2>Example 4: Custom Controls for Episode Navigation</h2>
      <VideoPlayer
        url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        layers={[
          {
            name: "controls",
            component: (
              <CustomControlLayer
                onNext={handleNext}
                onPrevious={handlePrevious}
                hasNext={true}
                hasPrevious={true}
              />
            ),
          },
        ]}
      />

      <h2>Example 5: Custom Layer with Inline Component</h2>
      <VideoPlayer
        url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        layers={[
          {
            name: "custom-notification",
            component: (
              <div className="absolute left-1/2 top-4 -translate-x-1/2 transform">
                <div className="rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg">
                  New episode available!
                </div>
              </div>
            ),
          },
        ]}
      />

      <h2>Example 6: Custom Layer with Custom Styles</h2>
      <VideoPlayer
        url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        layers={[
          {
            name: "styled-layer",
            component: (
              <div className="text-white">
                <p>Custom styled content</p>
              </div>
            ),
            style: {
              position: "absolute",
              bottom: "100px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "10px 20px",
              borderRadius: "8px",
            },
          },
        ]}
      />
    </div>
  );
}
