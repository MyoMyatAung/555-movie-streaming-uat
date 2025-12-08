/**
 * Collection API Module Exports
 *
 * Central export point for collection-related API functions and hooks.
 * Import from this module for a clean API surface.
 *
 * Usage:
 * ```typescript
 * import {
 *   useCollectionList,
 *   useCollectionDetail,
 *   useCreateCollection,
 *   useDeleteCollection,
 * } from "@/apis/collection";
 * ```
 *
 * Features:
 * - Collection CRUD operations
 * - Post management within collections
 * - Public/private visibility control
 * - Infinite scroll support
 *
 * @module collection
 */

// API Client Functions
export * from "./collectionApi";

// React Query Hooks - Queries
export * from "./queries";

// React Query Hooks - Mutations
export * from "./mutations";

