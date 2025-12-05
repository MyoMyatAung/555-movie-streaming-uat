/**
 * Movie Player Route Component
 * 
 * This component handles the movie player page with the following features:
 * - Video playback with multiple quality options
 * - Movie information and details
 * - User comments and interactions
 * - Download and feedback options
 * - Bullet comments overlay
 * 
 * Architecture:
 * - Uses TanStack Router for route management
 * - Implements React Query for data fetching and caching
 * - Follows component composition for better maintainability
 * - Separates concerns with dedicated sub-components
 */

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
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryGetPostDetail } from "@/apis/movie-detail";
import { FullScreenLoading } from "@/components/common/FullscreenLoading";

/**
 * Route definition for the movie player page
 * Path: /player/:id where :id is the post/movie ID
 */
export const Route = createFileRoute("/player/$id")({
  component: RouteComponent,
});

/**
 * RouteComponent - Main component for the movie player page
 * 
 * State Management:
 * - activeTab: Controls which tab is currently displayed (info or comments)
 * - openDownloadSheet: Controls the visibility of the download modal
 * - openFeedbackSheet: Controls the visibility of the feedback modal
 * - activeBulletComment: Toggles the bullet comment overlay on the video
 * - currentResourceIndex: Tracks which video quality/source is currently playing
 * 
 * Data Flow:
 * 1. Extract post ID from route parameters
 * 2. Fetch post details using React Query (with Suspense)
 * 3. Filter and prepare video files for playback
 * 4. Render video player with controls and overlays
 * 5. Render tabs for info and comments
 * 6. Handle user interactions (refresh, resource switch, etc.)
 */
function RouteComponent() {
  // Extract the post ID from route parameters
  const { id } = Route.useParams();
  
  // UI State Management
  const [activeTab, setActiveTab] = useState<"tab-1" | "tab-2">("tab-1");
  const [openDownloadSheet, setOpenDownloadSheet] = useState(false);
  const [openFeedbackSheet, setOpenFeedbackSheet] = useState(false);
  const [activeBulletComment, setActiveBulletComment] = useState(false);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);

  /**
   * Fetch movie/post data based on ID
   * 
   * Uses useSuspenseQuery for:
   * - Automatic loading state handling via Suspense boundary
   * - Automatic error handling via Error boundary
   * - Cached data with background refetching
   * - Type-safe data access
   */
  const { data: postDetail, isLoading, refetch } = useSuspenseQuery(
    queryGetPostDetail(id),
  );

  /**
   * Extract video files from post data
   * 
   * A post may contain multiple files (video, image, etc.)
   * We filter to get only video files for playback
   */
  const videoFiles = postDetail.data.files.filter(
    (file) => file.type === "video",
  );
  
  /**
   * Get the current video file to play
   * 
   * Falls back to the first video if the current index is out of bounds
   * This handles cases where the user switches resources or the data changes
   */
  const videoFile = videoFiles[currentResourceIndex] || videoFiles[0];
  const videoUrl = videoFile?.resourceURL || "";
  const posterUrl = postDetail.data.preview_image || videoFile?.thumbnail || "";

  /**
   * Handler for refreshing the player
   * 
   * Useful when:
   * - Video fails to load
   * - User wants to reload the video
   * - Network connection is restored
   */
  const handleRefresh = () => {
    refetch();
  };

  /**
   * Handler for switching to next available resource
   * 
   * Cycles through available video sources (different qualities, formats, etc.)
   * Uses modulo operator to wrap around to the first source after the last one
   */
  const handleSwitchResource = () => {
    if (videoFiles.length > 1) {
      setCurrentResourceIndex((prev) => (prev + 1) % videoFiles.length);
    }
  };

  /**
   * Memoize video layers to prevent unnecessary re-renders
   * 
   * Layers are overlays on top of the video player (e.g., bullet comments)
   * Memoization ensures the VideoPlayer component doesn't restart when other state changes
   * 
   * Dependencies:
   * - activeBulletComment: Only recalculate when this toggle changes
   */
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

  /**
   * Tab components mapping
   * 
   * Uses a Map for O(1) lookup performance and type safety.
   * Each tab component is memoized with a unique key to prevent unnecessary re-renders.
   * 
   * Tab 1: Movie Info - Displays movie details, feedback, and download options
   * Tab 2: Comments - Displays and manages user comments for the movie
   */
  const tabComponents = new Map([
    [
      "tab-1",
      <MovieInfo
        postDetail={postDetail.data}
        setOpenFeedbackSheet={setOpenFeedbackSheet}
        setOpenDownloadSheet={setOpenDownloadSheet}
        key="info"
      />,
    ],
    [
      "tab-2",
      <MovieComment key="comment" postId={id} />,
    ],
  ]);

  /**
   * Loading State Guard
   * 
   * Shows fullscreen loading while:
   * - Post data is being fetched
   * - Video URL is not yet available
   * 
   * This prevents rendering the player with incomplete data
   */
  if (isLoading || !videoUrl) {
    return <FullScreenLoading isVisible={true} showCloseButton={false} />;
  }

  /**
   * Main Render
   * 
   * Component Structure:
   * 1. VideoPlayer - The main video playback component with controls and overlays
   * 2. MovieTab - Tab navigation for switching between Info and Comments
   * 3. Tab Content - Dynamically rendered based on activeTab
   * 4. Modal Sheets - Download and Feedback modals (rendered but hidden when closed)
   * 
   * Benefits of this structure:
   * - Clear separation of concerns
   * - Easy to add new tabs or modals
   * - Modals are mounted once and toggled, preventing unnecessary re-renders
   */
  return (
    <>
      {/* 
        Video Player Component
        
        Handles:
        - Video playback with HLS/MP4 support
        - Custom controls (play, pause, seek, volume, fullscreen)
        - Overlay layers (bullet comments, annotations, etc.)
        - Error handling and network recovery
        - Multiple video source switching
      */}
      <VideoPlayer
        url={videoUrl}
        poster={posterUrl}
        autoplay={false}
        muted={false}
        layers={videoLayers}
        onRefresh={handleRefresh}
        onSwitchResource={handleSwitchResource}
        showSwitchResource={videoFiles.length > 1}
      />
      
      {/* 
        Tab Navigation Component
        
        Allows users to switch between:
        - Tab 1: Movie information, details, and actions
        - Tab 2: User comments and discussions
        
        Also includes toggle for bullet comments overlay
      */}
      <MovieTab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeBulletComment={activeBulletComment}
        setActiveBulletComment={setActiveBulletComment}
      />
      
      {/* 
        Tab Content Area
        
        Dynamically renders the active tab component from the Map
        Uses React Fragment to avoid extra DOM nesting
        The Map lookup provides O(1) performance
      */}
      <>{tabComponents.get(activeTab)}</>
      
      {/* 
        Download Sheet Modal
        
        Allows users to:
        - View available download options
        - Select video quality/format
        - Download movie episodes
        
        Controlled by openDownloadSheet state
      */}
      <MovieDownloadSheet
        openDownloadSheet={openDownloadSheet}
        setOpenDownloadSheet={setOpenDownloadSheet}
      />
      
      {/* 
        Feedback Sheet Modal
        
        Allows users to:
        - Report playback issues
        - Submit feedback about the movie
        - Report incorrect information
        
        Controlled by openFeedbackSheet state
        Requires postId to associate feedback with the correct post
      */}
      <MovieFeedbackSheet
        postId={id}
        openFeedbackSheet={openFeedbackSheet}
        setOpenFeedbackSheet={setOpenFeedbackSheet}
      />
    </>
  );
}
