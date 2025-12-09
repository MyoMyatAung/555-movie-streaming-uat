/**
 * Infinite Comments Hook
 * 
 * This module provides an infinite scroll implementation for comments.
 * It's an advanced feature that can be used when the basic pagination isn't enough.
 * 
 * Benefits:
 * - Smooth infinite scroll experience
 * - Automatic loading of next page on scroll
 * - Efficient memory management
 * - Cursor-based pagination for consistency
 * 
 * Usage Pattern:
 * This hook is designed for use with IntersectionObserver or scroll events
 * to automatically load more comments as the user scrolls down.
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchComments } from "./commentApi";
import { commentsKeys } from "./queryGetComments";
import type { FetchCommentsParams } from "@/types/comment";

/**
 * Options for configuring the infinite comments query
 */
interface UseInfiniteCommentsOptions {
  /**
   * The post ID to fetch comments for
   */
  postId: string;
  
  /**
   * Number of comments to fetch per page
   * @default 20
   */
  limit?: number;
  
  /**
   * Whether to enable the query
   * Useful for conditional fetching
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook for infinite scroll pagination of comments
 * 
 * This hook implements cursor-based pagination using React Query's
 * useInfiniteQuery. Each page knows about the next page cursor,
 * allowing for efficient and consistent pagination.
 * 
 * Features:
 * - Automatic page caching
 * - Optimistic updates support
 * - Built-in loading and error states
 * - Smart refetching strategy
 * 
 * @param options - Configuration options for the query
 * @returns Infinite query result with pagination helpers
 * 
 * @example
 * ```typescript
 * function CommentsWithInfiniteScroll({ postId }: { postId: string }) {
 *   const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 *     isLoading
 *   } = useInfiniteComments({ postId });
 * 
 *   // Set up intersection observer
 *   const observerRef = useRef<IntersectionObserver>();
 *   const lastCommentRef = useCallback((node: HTMLDivElement) => {
 *     if (isFetchingNextPage) return;
 *     if (observerRef.current) observerRef.current.disconnect();
 *     
 *     observerRef.current = new IntersectionObserver(entries => {
 *       if (entries[0].isIntersecting && hasNextPage) {
 *         fetchNextPage();
 *       }
 *     });
 *     
 *     if (node) observerRef.current.observe(node);
 *   }, [isFetchingNextPage, hasNextPage, fetchNextPage]);
 * 
 *   if (isLoading) return <div>Loading...</div>;
 * 
 *   // Flatten all pages into a single array
 *   const allComments = data?.pages.flatMap(page => page.data.list) ?? [];
 * 
 *   return (
 *     <div>
 *       {allComments.map((comment, index) => {
 *         const isLastComment = index === allComments.length - 1;
 *         return (
 *           <div
 *             key={comment.comment_id}
 *             ref={isLastComment ? lastCommentRef : undefined}
 *           >
 *             <CommentItem comment={comment} />
 *           </div>
 *         );
 *       })}
 *       {isFetchingNextPage && <div>Loading more...</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useInfiniteComments = ({
  postId,
  limit = 20,
  enabled = true,
}: UseInfiniteCommentsOptions) => {
  return useInfiniteQuery({
    queryKey: [...commentsKeys.byPost(postId), "infinite"],
    
    /**
     * Fetch function for each page
     * 
     * The pageParam is the cursor (last_comment_id) from the previous page
     * For the first page, pageParam is undefined
     */
    queryFn: ({ pageParam }) => {
      const params: FetchCommentsParams = {
        post_id: postId,
        limit,
        ...(pageParam && { last_comment_id: pageParam }),
      };
      return fetchComments(params);
    },
    
    /**
     * Determine the cursor for the next page
     * 
     * Returns undefined if there are no more pages to load
     * Otherwise, returns the ID of the last comment in the current page
     */
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasMore) {
        return undefined;
      }
      
      const lastComment = lastPage.data.list[lastPage.data.list.length - 1];
      return lastComment?.comment_id;
    },
    
    /**
     * Initial page parameter for the first page
     * undefined means no cursor (fetch from the beginning)
     */
    initialPageParam: undefined,
    
    // Cache configuration
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    
    // Only fetch if enabled
    enabled,
    
    // Retry configuration
    retry: 2,
    
    // Refetch on window focus
    refetchOnWindowFocus: true,
  });
};

