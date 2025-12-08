/**
 * Favourite API Module Exports
 *
 * Central export point for favourite-related API functions and hooks.
 *
 * Features:
 * - Add/remove favourites
 * - Check favourite status
 * - Get favourite list with pagination
 * - Favourite count for collection display
 *
 * @module favourite
 */

// API Client Functions
export * from "./favouriteApi";

// React Query Hooks - Queries
export * from "./queries";
export * from "./queryGetFavouriteCount";

// React Query Hooks - Mutations
export * from "./mutations";

