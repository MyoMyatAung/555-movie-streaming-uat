/**
 * Favourite API Module Exports
 * 
 * Central export point for favourite-related API functions and hooks.
 * 
 * Current Implementation:
 * - Favourite count query (for collection list)
 * 
 * Future Extensions:
 * - Add favourite mutation
 * - Remove favourite mutation
 * - Check favourite status query
 * - Full favourite list with pagination
 */

// API Client Functions
export * from "./favouriteApi";

// React Query Hooks
export * from "./queryGetFavouriteCount";

