import { queryOptions, useQuery } from "@tanstack/react-query";
import { getAvatarListApi } from "./avatarApi";

export const getAvatarListQueryOptions = () => {
  return queryOptions({
    queryKey: ["avatar", "list"],
    queryFn: getAvatarListApi,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
};

export function useGetAvatarList() {
  const query = useQuery(getAvatarListQueryOptions());

  const avatars = query.data?.data || [];

  return {
    ...query,
    avatars,
  };
}
