import { queryOptions } from "@tanstack/react-query";
import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type { PostDetail } from "@/types/movie-detail";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PostRecommendResponse {
  status: boolean;
  message: string;
  data: PostDetail[];
}

/**
 * Get recommended posts based on a specific post
 */
export async function getPostRecommendApi(
  postId: string,
): Promise<PostRecommendResponse> {
  const response = await AXIOS_CLIENT.get<PostRecommendResponse>(
    `${API_BASE_URL}/post/recommend`,
    {
      params: {
        post_id: postId,
      },
    },
  );
  return response.data;
}

export const QUERY_KEY = {
  postRecommend: (postId: string) => ["post", "recommend", postId] as const,
};

export const queryGetPostRecommend = (postId: string) =>
  queryOptions({
    queryKey: QUERY_KEY.postRecommend(postId),
    queryFn: () => getPostRecommendApi(postId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!postId,
  });

