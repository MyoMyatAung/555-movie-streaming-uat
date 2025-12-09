import { queryOptions } from "@tanstack/react-query";
import { getPostDetailApi } from "./movieDetailApi";

export const QUERY_KEY = {
  postDetail: (postId: string) => ["post", "detail", postId] as const,
};

export const queryGetPostDetail = (postId: string) =>
  queryOptions({
    queryKey: QUERY_KEY.postDetail(postId),
    queryFn: () => getPostDetailApi(postId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!postId,
  });

