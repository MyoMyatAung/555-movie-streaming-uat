import Artplayer from "artplayer";
import Hls from "hls.js";
import React, { useEffect, useRef, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

interface LayerConfig {
  name: string;
  component: ReactNode;
  position?: "top" | "center" | "bottom";
  style?: React.CSSProperties;
}

interface VideoPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
  muted?: boolean;
  layers?: LayerConfig[];
}

function VideoPlayer({
  url,
  poster,
  title,
  autoplay = false,
  muted = false,
  layers = [],
}: VideoPlayerProps) {
  const $container = useRef<HTMLDivElement>(null);
  const artRef = useRef<Artplayer | null>(null);
  const layerRootsRef = useRef<Map<string, Root>>(new Map());

  useEffect(() => {
    if (!$container.current) return;

    // Initialize artplayer
    const art = new Artplayer({
      container: $container.current,
      url,
      poster,
      autoplay,
      muted,
      volume: 0.5,
      isLive: false,
      autoSize: false,
      autoMini: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: "#0065FF",
      lang: navigator.language.toLowerCase(),
      moreVideoAttr: {
        crossOrigin: "anonymous",
      },
      layers: layers.map((layer) => ({
        name: layer.name,
        html: "",
        style: (layer.style as Record<string, string>) || {},
        mounted: (layerElement: HTMLElement) => {
          // Create a React root and render the component
          const root = createRoot(layerElement);
          root.render(layer.component);
          layerRootsRef.current.set(layer.name, root);
        },
      })),
      customType: {
        m3u8: (video: HTMLMediaElement, url: string) => {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);

            // Optional: Handle HLS events
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              console.log("HLS manifest loaded");
              
              // Enable quality selector if multiple levels are available
              if (hls.levels.length > 1) {
                const qualities = hls.levels.map((level, index) => ({
                  default: index === 0,
                  html: level.height ? `${level.height}p` : `Level ${index}`,
                  url: url,
                  level: index,
                }));

                // Add Auto quality option
                qualities.unshift({
                  default: false,
                  html: 'Auto',
                  url: url,
                  level: -1,
                });

                art.quality = qualities;
                
                // Set up quality switching
                art.on('quality', (...args: unknown[]) => {
                  const quality = args[0] as { level: number };
                  if (quality.level === -1) {
                    hls.currentLevel = -1; // Auto quality
                  } else {
                    hls.currentLevel = quality.level;
                  }
                });
              }
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.error(
                      "Network error encountered, trying to recover",
                    );
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.error("Media error encountered, trying to recover");
                    hls.recoverMediaError();
                    break;
                  default:
                    console.error("Fatal error encountered, cannot recover");
                    hls.destroy();
                    break;
                }
              }
            });

            // Clean up HLS instance when video is destroyed
            art.on("destroy", () => {
              if (hls) {
                hls.destroy();
              }
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // For Safari native HLS support
            video.src = url;
          } else {
            console.error("HLS is not supported in this browser");
          }
        },
      },
    });

    artRef.current = art;

    // Cleanup on unmount
    return () => {
      // Unmount all React roots
      layerRootsRef.current.forEach((root) => {
        root.unmount();
      });
      layerRootsRef.current.clear();

      if (artRef.current) {
        artRef.current.destroy();
        artRef.current = null;
      }
    };
  }, [url, poster, title, autoplay, muted, layers]);

  return <div ref={$container} className="aspect-video w-full"></div>;
}

export default React.memo(VideoPlayer);
