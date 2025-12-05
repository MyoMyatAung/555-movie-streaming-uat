/**
 * Favourite API Client
 * 
 * This module provides API client functions for the Favourite feature.
 * Currently implements only the list endpoint to get favorite count
 * for the default collection display.
 * 
 * API Endpoints:
 * - GET /favourite/list - Get user's favourite posts (paginated)
 * 
 * Note: This is a minimal implementation focused on collection integration.
 * For full favourite feature implementation, extend this file with:
 * - POST /favourite/add
 * - POST /favourite/remove  
 * - GET /favourite/check
 * 
 * @see API Documentation in api.md (Favourite API section)
 */

import { AXIOS_CLIENT } from "@/lib/axios-api-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Favourite List Response
 * 
 * Response structure from GET /favourite/list endpoint.
 * Contains paginated list of favourited posts with metadata.
 */
export interface GetFavouriteListResponse {
  status: boolean;
  message: string;
  data: {
    favourites: unknown[]; // We don't need the full post structure for count
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
}

/**
 * Get Favourite Count
 * 
 * Fetches the user's favourite list to extract the total count.
 * Only fetches the first page with minimal items since we only
 * need the total count for display purposes.
 * 
 * Performance Optimization:
 * - Requests only 1 item per page (we don't use the data)
 * - API still returns correct total count in pagination metadata
 * - Reduces payload size and transfer time
 * 
 * @returns Promise with favourite list response (including total count)
 * 
 * @throws {AxiosError} When request fails (network error, auth error, etc.)
 * 
 * @example
 * ```typescript
 * const response = await getFavouriteCountApi();
 * const count = response.data.total;
 * console.log(`User has ${count} favourites`);
 * ```
 */
export async function getFavouriteCountApi(): Promise<GetFavouriteListResponse> {
  const response = await AXIOS_CLIENT.get<GetFavouriteListResponse>(
    `${API_BASE_URL}/favourite/list`,
    {
      params: {
        page: 1,
        per_page: 1, // Minimal payload - we only need the total count
      },
    }
  );
  return response.data;
}

