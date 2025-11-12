// Cache configuration constants
export const CACHE_CONFIG = {
  // Static data (countries, languages, etc.)
  STATIC_DATA: {
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  },

  // User data (folders, favorites, etc.)
  USER_DATA: {
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 10000),
  },

  // Real-time data (notifications, messages)
  REALTIME_DATA: {
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 1000 * 60, // Refetch every minute
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(500 * 2 ** attemptIndex, 5000),
  },

  // API responses that rarely change
  INFREQUENT_DATA: {
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: (attemptIndex: number) =>
      Math.min(2000 * 2 ** attemptIndex, 60000),
  },
} as const;

export const QUERY_KEYS = {
  SOCIAL: "social",
} as const;

// Helper function to create consistent query keys
export const createQueryKey = (
  prefix: string,
  ...parts: Array<string | number>
) => {
  return [prefix, ...parts].filter(Boolean);
};

// Helper function to create cache configuration
export const createCacheConfig = (type: keyof typeof CACHE_CONFIG) => {
  return CACHE_CONFIG[type];
};

export default CACHE_CONFIG;
