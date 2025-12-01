import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type { IndexRecommendResponse } from "@/types/post";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get index recommend posts
 */
export async function getIndexRecommendApi(): Promise<IndexRecommendResponse> {
  const response = await AXIOS_CLIENT.get<IndexRecommendResponse>(
    `${API_BASE_URL}/post/index_recommend`,
  );
  return response.data;
}

