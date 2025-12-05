import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type { PostDetailResponse } from "@/types/movie-detail";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get post detail by post ID
 */
export async function getPostDetailApi(
  postId: string,
): Promise<PostDetailResponse> {
  const response = await AXIOS_CLIENT.get<PostDetailResponse>(
    `${API_BASE_URL}/post/detail`,
    {
      params: {
        post_id: postId,
      },
    },
  );
  return response.data;
}

