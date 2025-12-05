import { MovieCard } from "./MovieCard";
import { MovieCardSkeleton } from "../skeletons/MovieCardSkeleton";
import type { PostDetail } from "@/types/movie-detail";
import type { ContentItem } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";
import { queryGetPostRecommend } from "@/apis/movie-detail";

interface MoreMovieProps {
  postId: string;
}

export function MoreMovie({ postId }: MoreMovieProps) {
  // Fetch recommended posts from API
  const { data, isLoading, isError } = useQuery(queryGetPostRecommend(postId));

  // Convert PostDetail to ContentItem format for MovieCard
  const convertToContentItem = (post: PostDetail): ContentItem => ({
    id: post.post_id,
    title: post.title,
    imageUrl: post.preview_image,
    type: "movie", // Default to movie type
    rating: post.rating || post.score,
    genres: post.tag || [],
  });

  // Show skeleton loaders while loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <MovieCardSkeleton key={item} />
        ))}
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="py-8 text-center text-gray-400">
        Failed to load recommendations
      </div>
    );
  }

  // Show empty state if no related posts
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        No related movies available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.data.map((post) => (
        <MovieCard key={post.post_id} item={convertToContentItem(post)} />
      ))}
    </div>
  );
}