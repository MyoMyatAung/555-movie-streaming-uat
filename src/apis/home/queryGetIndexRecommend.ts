import { queryOptions, useQuery } from "@tanstack/react-query";
import { getIndexRecommendApi } from "./postApi";

export const getIndexRecommendQueryOptions = () => {
  return queryOptions({
    queryKey: ["post", "index_recommend"],
    queryFn: getIndexRecommendApi,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
};

export function useGetIndexRecommend() {
  const query = useQuery(getIndexRecommendQueryOptions());

  const sections = query.data?.data || [];

  return {
    ...query,
    sections,
  };
}
