/**
 * Collection Mutation Hooks
 *
 * React Query mutation hooks for modifying collection data.
 * Follows the Single Responsibility Principle - each hook handles one operation.
 *
 * Mutation Pattern:
 * 1. Call API function
 * 2. Invalidate relevant queries on success
 * 3. Handle optimistic updates where appropriate
 *
 * @see collectionApi.ts for underlying API functions
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCollection,
  updateCollection,
  deleteCollection,
  addPostToCollection,
  removePostFromCollection,
  removePostsFromCollectionBatch,
  addToMultipleCollections,
  reorderPosts,
  shareCollection,
} from "./collectionApi";
import { collectionKeys } from "./queries";
import type {
  CreateCollectionRequest,
  CreateCollectionWithFileRequest,
  UpdateCollectionRequest,
  UpdateCollectionWithFileRequest,
  DeleteCollectionRequest,
  AddPostToCollectionRequest,
  RemovePostFromCollectionRequest,
  RemovePostsFromCollectionRequest,
  AddToMultipleCollectionsRequest,
  ReorderPostsRequest,
  ShareCollectionRequest,
  ApiResponse,
  CreateCollectionData,
  UpdateCollectionData,
  DeleteCollectionData,
  AddPostData,
  RemovePostData,
  RemovePostsBatchData,
  AddToMultipleData,
  ReorderPostsData,
  ShareCollectionData,
} from "@/types/collection";

// =============================================================================
// Collection CRUD Mutations
// =============================================================================

/**
 * useCreateCollection Hook
 *
 * Creates a new collection for the authenticated user.
 * Supports both JSON and multipart/form-data requests for file uploads.
 * Automatically invalidates the collection list cache on success.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate, isPending, error } = useCreateCollection();
 *
 * // Create collection with file upload
 * mutate(
 *   { name: "Watch Later", is_public: false, thumbnail: imageFile },
 *   {
 *     onSuccess: (data) => {
 *       console.log(`Created: ${data.data.collection.name}`);
 *       navigate(`/profile/collection/${data.data.collection.id}`);
 *     },
 *     onError: (error) => {
 *       toast.error("Failed to create collection");
 *     },
 *   }
 * );
 * ```
 */
export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CreateCollectionData>,
    Error,
    CreateCollectionRequest | CreateCollectionWithFileRequest
  >({
    mutationFn: createCollection,
    onSuccess: () => {
      // Invalidate collection list to show new collection
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
  });
}

/**
 * useUpdateCollection Hook
 *
 * Updates an existing collection's details.
 * Supports both JSON and multipart/form-data requests for file uploads.
 * Invalidates both the list and the specific collection's detail cache.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useUpdateCollection();
 *
 * // With file upload
 * mutate(
 *   {
 *     collection_id: "uuid",
 *     name: "Updated Name",
 *     thumbnail: newImageFile,
 *   },
 *   {
 *     onSuccess: () => toast.success("Collection updated"),
 *   }
 * );
 * ```
 */
export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UpdateCollectionData>,
    Error,
    UpdateCollectionRequest | UpdateCollectionWithFileRequest
  >({
    mutationFn: updateCollection,
    onSuccess: (_, variables) => {
      // Invalidate both list and specific collection
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(variables.collection_id),
      });
    },
  });
}

/**
 * useDeleteCollection Hook
 *
 * Deletes a collection permanently.
 * Posts within the collection are not deleted, only unlinked.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useDeleteCollection();
 *
 * // Confirm before deleting
 * if (confirm("Delete this collection?")) {
 *   mutate(
 *     { collection_id: "uuid" },
 *     {
 *       onSuccess: () => {
 *         toast.success("Collection deleted");
 *         navigate("/profile/collection");
 *       },
 *     }
 *   );
 * }
 * ```
 */
export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<DeleteCollectionData>,
    Error,
    DeleteCollectionRequest
  >({
    mutationFn: deleteCollection,
    onSuccess: (_, variables) => {
      // Invalidate list and remove specific collection from cache
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      queryClient.removeQueries({
        queryKey: collectionKeys.detail(variables.collection_id),
      });
    },
  });
}

// =============================================================================
// Post Management Mutations
// =============================================================================

/**
 * useAddPostToCollection Hook
 *
 * Adds a post to a specific collection.
 * Invalidates the collection detail cache to update post count.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate } = useAddPostToCollection();
 *
 * mutate(
 *   { collection_id: "collection-uuid", post_id: "post-uuid" },
 *   {
 *     onSuccess: (data) => {
 *       toast.success(`Added to ${data.data.collection.name}`);
 *     },
 *     onError: () => {
 *       toast.error("Post already in collection");
 *     },
 *   }
 * );
 * ```
 */
export function useAddPostToCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<AddPostData>,
    Error,
    AddPostToCollectionRequest
  >({
    mutationFn: addPostToCollection,
    onSuccess: (_, variables) => {
      // Invalidate list (for post count) and collection detail
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(variables.collection_id),
      });
    },
  });
}

/**
 * useRemovePostFromCollection Hook
 *
 * Removes a single post from a collection.
 * The post itself is not deleted, only unlinked from the collection.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate } = useRemovePostFromCollection();
 *
 * mutate(
 *   { collection_id: "collection-uuid", post_id: "post-uuid" },
 *   {
 *     onSuccess: () => toast.success("Removed from collection"),
 *   }
 * );
 * ```
 */
export function useRemovePostFromCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RemovePostData>,
    Error,
    RemovePostFromCollectionRequest
  >({
    mutationFn: removePostFromCollection,
    onSuccess: (_, variables) => {
      // Invalidate list (for post count) and collection detail
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(variables.collection_id),
      });
    },
  });
}

/**
 * useRemovePostsFromCollectionBatch Hook
 *
 * Removes multiple posts from a collection in a single API call.
 * Supports partial success - some may succeed while others fail.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate } = useRemovePostsFromCollectionBatch();
 *
 * mutate(
 *   { collection_id: "collection-uuid", post_id: ["post-1", "post-2"] },
 *   {
 *     onSuccess: (data) => {
 *       toast.success(`Removed ${data.data.removed_count} posts`);
 *     },
 *   }
 * );
 * ```
 */
export function useRemovePostsFromCollectionBatch() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RemovePostsBatchData>,
    Error,
    RemovePostsFromCollectionRequest
  >({
    mutationFn: removePostsFromCollectionBatch,
    onSuccess: (_, variables) => {
      // Invalidate list (for post count) and collection detail
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(variables.collection_id),
      });
    },
  });
}

/**
 * useAddToMultipleCollections Hook
 *
 * Adds a single post to multiple collections at once.
 * Useful for "Add to Collection" modal with checkboxes.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useAddToMultipleCollections();
 *
 * mutate(
 *   {
 *     post_id: "post-uuid",
 *     collection_ids: selectedCollectionIds,
 *   },
 *   {
 *     onSuccess: (data) => {
 *       toast.success(`Added to ${data.data.added_count} collections`);
 *       if (data.data.error_count > 0) {
 *         console.warn("Some additions failed:", data.data.errors);
 *       }
 *     },
 *   }
 * );
 * ```
 */
export function useAddToMultipleCollections() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<AddToMultipleData>,
    Error,
    AddToMultipleCollectionsRequest
  >({
    mutationFn: addToMultipleCollections,
    onSuccess: (data, variables) => {
      // Invalidate list and all affected collections
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      
      // Invalidate each successfully added collection
      data.data.added.forEach((item) => {
        queryClient.invalidateQueries({
          queryKey: collectionKeys.detail(item.collection_id),
        });
      });
    },
  });
}

/**
 * useReorderPosts Hook
 *
 * Reorders posts within a collection.
 * Useful for drag-and-drop reordering UI.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate } = useReorderPosts();
 *
 * // After drag-and-drop
 * const newOrder = reorderedPosts.map((post, index) => ({
 *   post_id: post.id,
 *   sort_order: index,
 * }));
 *
 * mutate(
 *   { collection_id: "uuid", post_orders: newOrder },
 *   {
 *     onSuccess: () => toast.success("Order saved"),
 *   }
 * );
 * ```
 */
export function useReorderPosts() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ReorderPostsData>,
    Error,
    ReorderPostsRequest
  >({
    mutationFn: reorderPosts,
    onSuccess: (_, variables) => {
      // Invalidate collection detail to reflect new order
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(variables.collection_id),
      });
    },
  });
}

// =============================================================================
// Visibility Mutations
// =============================================================================

/**
 * useShareCollection Hook
 *
 * Toggles a collection's public/private status.
 * Public collections are discoverable by other users.
 *
 * @returns Mutation object with mutate/mutateAsync functions
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useShareCollection();
 *
 * // Make public
 * mutate(
 *   { collection_id: "uuid", is_public: true },
 *   {
 *     onSuccess: () => toast.success("Collection is now public"),
 *   }
 * );
 *
 * // Make private
 * mutate(
 *   { collection_id: "uuid", is_public: false },
 *   {
 *     onSuccess: () => toast.success("Collection is now private"),
 *   }
 * );
 * ```
 */
export function useShareCollection() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ShareCollectionData>,
    Error,
    ShareCollectionRequest
  >({
    mutationFn: shareCollection,
    onSuccess: (_, variables) => {
      // Invalidate list and specific collection
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(variables.collection_id),
      });
      // Also invalidate public collections list
      queryClient.invalidateQueries({ queryKey: collectionKeys.public() });
    },
  });
}

