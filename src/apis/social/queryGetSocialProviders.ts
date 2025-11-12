import { getSocialProvidersApi } from "@/apis/social/socialApi";
import {
  createCacheConfig,
  createQueryKey,
  QUERY_KEYS,
} from "@/lib/cache-config";
import { useQuery } from "@tanstack/react-query";

/**
 * React Query hook for fetching social login providers
 */
export function useGetSocialProviders() {
  return useQuery({
    queryKey: createQueryKey(QUERY_KEYS.SOCIAL, "social-providers"),
    queryFn: getSocialProvidersApi,
    ...createCacheConfig("STATIC_DATA"),
  });
}
