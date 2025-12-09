/**
 * Collection API Client
 *
 * This module provides API client functions for collection-related operations.
 * It follows the Single Responsibility Principle by handling only API communication.
 *
 * Collections allow users to organize posts into custom named groups (like playlists).
 * Features include: create/update/delete collections, add/remove posts, reorder, and share.
 *
 * API Endpoints:
 * - POST /collection/create - Create a new collection
 * - PUT /collection/update - Update collection details
 * - DELETE /collection/delete - Delete a collection
 * - GET /collection/list - Get user's collections
 * - GET /collection/detail - Get collection with posts
 * - POST /collection/add-post - Add post to collection
 * - POST /collection/remove-post - Remove post from collection
 * - POST /collection/add-to-multiple - Add post to multiple collections
 * - POST /collection/reorder - Reorder posts in collection
 * - POST /collection/share - Make collection public/private
 * - GET /collection/public - Browse public collections
 *
 * @see API Documentation in api.md (Collection API section)
 */

import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type {
  ApiResponse,
  CollectionListData,
  CollectionDetailData,
  CreateCollectionData,
  UpdateCollectionData,
  DeleteCollectionData,
  AddPostData,
  RemovePostData,
  RemovePostsBatchData,
  AddToMultipleData,
  ReorderPostsData,
  ShareCollectionData,
  PublicCollectionsData,
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
  CollectionListParams,
  CollectionDetailParams,
  PaginationParams,
} from "@/types/collection";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =============================================================================
// Collection CRUD Operations
// =============================================================================

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Build FormData from collection request data
 *
 * Converts a collection request object to FormData for multipart/form-data requests.
 * Handles both primitive values and File objects.
 *
 * @param data - Collection request data
 * @returns FormData object ready for submission
 */
function buildCollectionFormData(
  data: CreateCollectionWithFileRequest | UpdateCollectionWithFileRequest
): FormData {
  const formData = new FormData();

  // Add collection_id for update requests
  if ("collection_id" in data && data.collection_id) {
    formData.append("collection_id", data.collection_id);
  }

  // Add name if provided
  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  // Add description if provided
  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  // Add is_public if provided (convert boolean to string for FormData)
  if (data.is_public !== undefined) {
    formData.append("is_public", data.is_public ? "1" : "0");
  }

  // Add thumbnail file if provided
  if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail);
  }

  // Add sort_order if provided
  if (data.sort_order !== undefined) {
    formData.append("sort_order", data.sort_order.toString());
  }

  return formData;
}

/**
 * Check if request has a file to upload
 */
function hasFileUpload(
  data: CreateCollectionRequest | CreateCollectionWithFileRequest
): data is CreateCollectionWithFileRequest {
  return "thumbnail" in data && data.thumbnail instanceof File;
}

/**
 * Check if update request has a file to upload
 */
function hasUpdateFileUpload(
  data: UpdateCollectionRequest | UpdateCollectionWithFileRequest
): data is UpdateCollectionWithFileRequest {
  return "thumbnail" in data && data.thumbnail instanceof File;
}

// =============================================================================
// Collection CRUD Operations
// =============================================================================

/**
 * Create a new collection
 *
 * Creates a new collection for the authenticated user.
 * Collections can be public (discoverable) or private (only visible to owner).
 *
 * Supports two modes:
 * 1. JSON request (thumbnail_url) - when providing an existing image URL
 * 2. FormData request (thumbnail) - when uploading an image file
 *
 * @param data - Collection creation data (name required, others optional)
 * @returns Promise resolving to created collection data
 *
 * @example
 * ```typescript
 * // With file upload
 * const response = await createCollection({
 *   name: "Watch Later",
 *   description: "Movies to watch this weekend",
 *   is_public: false,
 *   thumbnail: imageFile, // File object
 * });
 *
 * // With URL
 * const response = await createCollection({
 *   name: "Watch Later",
 *   thumbnail_url: "https://example.com/image.jpg",
 * });
 * ```
 */
export async function createCollection(
  data: CreateCollectionRequest | CreateCollectionWithFileRequest
): Promise<ApiResponse<CreateCollectionData>> {
  // Check if we need to use FormData for file upload
  if (hasFileUpload(data)) {
    const formData = buildCollectionFormData(data);
    const response = await AXIOS_CLIENT.post<ApiResponse<CreateCollectionData>>(
      `${API_BASE_URL}/collection/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Regular JSON request
  const response = await AXIOS_CLIENT.post<ApiResponse<CreateCollectionData>>(
    `${API_BASE_URL}/collection/create`,
    data
  );
  return response.data;
}

/**
 * Update collection details
 *
 * Updates an existing collection's metadata.
 * Only the collection owner can update their collections.
 * All fields except collection_id are optional - only provided fields are updated.
 *
 * Supports two modes:
 * 1. JSON request (thumbnail_url) - when providing an existing image URL
 * 2. FormData request (thumbnail) - when uploading an image file
 *
 * Note: Uses POST method with multipart/form-data for file uploads.
 * Old thumbnail is automatically deleted when uploading a new one.
 *
 * @param data - Update data with collection_id and fields to update
 * @returns Promise resolving to updated collection data
 *
 * @example
 * ```typescript
 * // With file upload
 * const response = await updateCollection({
 *   collection_id: "uuid-here",
 *   name: "Must Watch",
 *   thumbnail: newImageFile, // File object
 * });
 *
 * // Without file
 * const response = await updateCollection({
 *   collection_id: "uuid-here",
 *   name: "Must Watch",
 *   is_public: true,
 * });
 * ```
 */
export async function updateCollection(
  data: UpdateCollectionRequest | UpdateCollectionWithFileRequest
): Promise<ApiResponse<UpdateCollectionData>> {
  // Check if we need to use FormData for file upload
  if (hasUpdateFileUpload(data)) {
    const formData = buildCollectionFormData(data);
    // Note: API uses POST for file uploads, not PUT
    const response = await AXIOS_CLIENT.post<ApiResponse<UpdateCollectionData>>(
      `${API_BASE_URL}/collection/update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Regular JSON request - can use PUT
  const response = await AXIOS_CLIENT.post<ApiResponse<UpdateCollectionData>>(
    `${API_BASE_URL}/collection/update`,
    data
  );
  return response.data;
}

/**
 * Delete a collection
 *
 * Permanently deletes a collection and removes all post associations.
 * The posts themselves are not deleted, only the collection references.
 * Only the collection owner can delete their collections.
 *
 * @param data - Delete request with collection_id
 * @returns Promise resolving to deletion confirmation
 *
 * @example
 * ```typescript
 * const response = await deleteCollection({ collection_id: "uuid-here" });
 * if (response.data.deleted) {
 *   console.log("Collection deleted successfully");
 * }
 * ```
 */
export async function deleteCollection(
  data: DeleteCollectionRequest
): Promise<ApiResponse<DeleteCollectionData>> {
  const response = await AXIOS_CLIENT.delete<ApiResponse<DeleteCollectionData>>(
    `${API_BASE_URL}/collection/delete`,
    { data }
  );
  return response.data;
}

// =============================================================================
// Collection Retrieval Operations
// =============================================================================

/**
 * Get user's collections list
 *
 * Fetches all collections belonging to the authenticated user.
 * Includes a virtual "Favorite" collection (id: "favorite") as the first item.
 * Collections are ordered by sort_order (ascending), then creation date (descending).
 *
 * @param params - Pagination parameters (page, per_page)
 * @returns Promise resolving to paginated collections list
 *
 * @example
 * ```typescript
 * // Fetch first page of collections
 * const response = await getCollectionList({ page: 1, per_page: 20 });
 * console.log(`Total collections: ${response.data.total}`);
 *
 * // Fetch next page
 * const nextPage = await getCollectionList({ page: 2, per_page: 20 });
 * ```
 */
export async function getCollectionList(
  params: CollectionListParams = {}
): Promise<ApiResponse<CollectionListData>> {
  const { page = 1, per_page = 20 } = params;
  const response = await AXIOS_CLIENT.get<ApiResponse<CollectionListData>>(
    `${API_BASE_URL}/collection/list`,
    { params: { page, per_page } }
  );
  return response.data;
}

/**
 * Get collection details with posts
 *
 * Fetches a collection's full details including its posts.
 * Public collections can be viewed by anyone.
 * Private collections can only be viewed by the owner.
 *
 * @param params - Query params with collection_id and pagination
 * @returns Promise resolving to collection details with posts
 *
 * @example
 * ```typescript
 * const response = await getCollectionDetail({
 *   collection_id: "uuid-here",
 *   page: 1,
 *   per_page: 20,
 * });
 * const { collection, posts, total_posts } = response.data;
 * ```
 */
export async function getCollectionDetail(
  params: CollectionDetailParams
): Promise<ApiResponse<CollectionDetailData>> {
  const { collection_id, page = 1, per_page = 20 } = params;
  const response = await AXIOS_CLIENT.get<ApiResponse<CollectionDetailData>>(
    `${API_BASE_URL}/collection/detail`,
    { params: { collection_id, page, per_page } }
  );
  return response.data;
}

/**
 * Browse public collections
 *
 * Fetches publicly shared collections from all users.
 * Useful for discovering curated content.
 * Works with or without authentication.
 *
 * @param params - Pagination parameters
 * @returns Promise resolving to paginated public collections
 *
 * @example
 * ```typescript
 * const response = await getPublicCollections({ page: 1, per_page: 20 });
 * response.data.collections.forEach(collection => {
 *   console.log(`${collection.name} by ${collection.user?.nickname}`);
 * });
 * ```
 */
export async function getPublicCollections(
  params: PaginationParams = {}
): Promise<ApiResponse<PublicCollectionsData>> {
  const { page = 1, per_page = 20 } = params;
  const response = await AXIOS_CLIENT.get<ApiResponse<PublicCollectionsData>>(
    `${API_BASE_URL}/collection/public`,
    { params: { page, per_page } }
  );
  return response.data;
}

// =============================================================================
// Post Management Operations
// =============================================================================

/**
 * Add a post to a collection
 *
 * Adds a post to the specified collection.
 * Post is added at the end of the collection (highest sort_order).
 * A post can only be added once to a collection.
 *
 * @param data - Request with collection_id and post_id
 * @returns Promise resolving to add confirmation with updated count
 *
 * @example
 * ```typescript
 * const response = await addPostToCollection({
 *   collection_id: "collection-uuid",
 *   post_id: "post-uuid",
 * });
 * console.log(`Collection now has ${response.data.collection.posts_count} posts`);
 * ```
 */
export async function addPostToCollection(
  data: AddPostToCollectionRequest
): Promise<ApiResponse<AddPostData>> {
  const response = await AXIOS_CLIENT.post<ApiResponse<AddPostData>>(
    `${API_BASE_URL}/collection/add-post`,
    data
  );
  return response.data;
}

/**
 * Remove a post from a collection (single)
 *
 * Removes a post from the specified collection.
 * The post itself is not deleted, only removed from the collection.
 *
 * @param data - Request with collection_id and post_id
 * @returns Promise resolving to removal confirmation
 *
 * @example
 * ```typescript
 * const response = await removePostFromCollection({
 *   collection_id: "collection-uuid",
 *   post_id: "post-uuid",
 * });
 * if (response.data.removed) {
 *   console.log("Post removed from collection");
 * }
 * ```
 */
export async function removePostFromCollection(
  data: RemovePostFromCollectionRequest
): Promise<ApiResponse<RemovePostData>> {
  const response = await AXIOS_CLIENT.post<ApiResponse<RemovePostData>>(
    `${API_BASE_URL}/collection/remove-post`,
    data
  );
  return response.data;
}

/**
 * Remove multiple posts from a collection (batch)
 *
 * Removes multiple posts from the specified collection in a single request.
 * Supports partial success - some may succeed while others fail.
 *
 * @param data - Request with collection_id and array of post_ids
 * @returns Promise resolving to batch removal results
 *
 * @example
 * ```typescript
 * const response = await removePostsFromCollectionBatch({
 *   collection_id: "collection-uuid",
 *   post_id: ["post-1", "post-2", "post-3"],
 * });
 * console.log(`Removed ${response.data.removed_count} posts`);
 * if (response.data.failed_count > 0) {
 *   console.log("Some removals failed:", response.data.failed);
 * }
 * ```
 */
export async function removePostsFromCollectionBatch(
  data: RemovePostsFromCollectionRequest
): Promise<ApiResponse<RemovePostsBatchData>> {
  const response = await AXIOS_CLIENT.post<ApiResponse<RemovePostsBatchData>>(
    `${API_BASE_URL}/collection/remove-post`,
    data
  );
  return response.data;
}

/**
 * Add a post to multiple collections at once
 *
 * Batch operation to add a single post to multiple collections.
 * Useful for "Add to Collection" modal with multiple checkboxes.
 * Partial success is allowed - some may succeed while others fail.
 *
 * @param data - Request with post_id and array of collection_ids
 * @returns Promise resolving to results with success/error arrays
 *
 * @example
 * ```typescript
 * const response = await addToMultipleCollections({
 *   post_id: "post-uuid",
 *   collection_ids: ["collection-1", "collection-2", "collection-3"],
 * });
 * console.log(`Added to ${response.data.added_count} collections`);
 * if (response.data.error_count > 0) {
 *   console.log("Some additions failed:", response.data.errors);
 * }
 * ```
 */
export async function addToMultipleCollections(
  data: AddToMultipleCollectionsRequest
): Promise<ApiResponse<AddToMultipleData>> {
  const response = await AXIOS_CLIENT.post<ApiResponse<AddToMultipleData>>(
    `${API_BASE_URL}/collection/add-to-multiple`,
    data
  );
  return response.data;
}

/**
 * Reorder posts within a collection
 *
 * Updates the sort order of posts in a collection.
 * Useful for implementing drag-and-drop reordering.
 * Can update all posts or just specific ones.
 *
 * @param data - Request with collection_id and post_orders array
 * @returns Promise resolving to reorder confirmation
 *
 * @example
 * ```typescript
 * const response = await reorderPosts({
 *   collection_id: "collection-uuid",
 *   post_orders: [
 *     { post_id: "post-1", sort_order: 1 },
 *     { post_id: "post-2", sort_order: 2 },
 *     { post_id: "post-3", sort_order: 3 },
 *   ],
 * });
 * ```
 */
export async function reorderPosts(
  data: ReorderPostsRequest
): Promise<ApiResponse<ReorderPostsData>> {
  const response = await AXIOS_CLIENT.post<ApiResponse<ReorderPostsData>>(
    `${API_BASE_URL}/collection/reorder`,
    data
  );
  return response.data;
}

// =============================================================================
// Visibility Operations
// =============================================================================

/**
 * Share or unshare a collection
 *
 * Updates a collection's public visibility status.
 * Public collections appear in the /collection/public endpoint.
 * Private collections are only visible to the owner.
 *
 * @param data - Request with collection_id and is_public flag
 * @returns Promise resolving to updated collection data
 *
 * @example
 * ```typescript
 * // Make collection public
 * await shareCollection({ collection_id: "uuid", is_public: true });
 *
 * // Make collection private
 * await shareCollection({ collection_id: "uuid", is_public: false });
 * ```
 */
export async function shareCollection(
  data: ShareCollectionRequest
): Promise<ApiResponse<ShareCollectionData>> {
  const response = await AXIOS_CLIENT.post<ApiResponse<ShareCollectionData>>(
    `${API_BASE_URL}/collection/share`,
    data
  );
  return response.data;
}

