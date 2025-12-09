/**
 * Feedback API Client
 * 
 * This module provides API client functions for feedback-related operations.
 * It follows the Single Responsibility Principle by handling only API communication.
 * 
 * API Endpoints:
 * - GET /api/v1/problem-types/list - Fetch available problem types
 * - POST /api/v1/feedback/submit - Submit feedback for a post
 * 
 * @see api.md for full API documentation
 */

import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import type {
  ProblemTypesListResponse,
  SubmitFeedbackRequest,
  SubmitFeedbackResponse,
} from "@/types/feedback";

/**
 * Base URL for API requests
 * Retrieved from environment variables for environment-specific configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches the list of available problem types for feedback submission
 * 
 * This endpoint is publicly accessible (no authentication required).
 * Problem types are used to categorize user feedback and are managed
 * by administrators in the backend.
 * 
 * Features:
 * - Returns only active problem types
 * - Results ordered by sort_order (ascending)
 * - No pagination (returns all types at once)
 * 
 * @returns Promise resolving to the problem types list response
 * 
 * @example
 * ```typescript
 * const response = await fetchProblemTypes();
 * const problemTypes = response.data;
 * // [
 * //   { name: "playback_issues", description: "Video playback problems..." },
 * //   { name: "incomplete_episodes", description: "Missing episodes..." },
 * //   ...
 * // ]
 * ```
 * 
 * @throws {AxiosError} When the API request fails
 */
export const fetchProblemTypes = async (): Promise<ProblemTypesListResponse> => {
  const response = await AXIOS_CLIENT.get<ProblemTypesListResponse>(
    `${API_BASE_URL}/problem-types/list`,
  );
  return response.data;
};

/**
 * Submits feedback for a specific post/film
 * 
 * This function allows authenticated users to report issues with posts.
 * All feedback submissions are stored for review by administrators.
 * 
 * Requirements:
 * - Authentication required (Bearer token)
 * - post_id must reference an existing post
 * - problem_type_id must reference an active problem type
 * - description must be 10-2000 characters
 * 
 * Common Use Cases:
 * - Reporting playback issues (buffering, freezing)
 * - Reporting missing or incomplete episodes
 * - Reporting incorrect information
 * - Reporting bugs or errors
 * 
 * @param data - The feedback data to submit
 * @returns Promise resolving to the created feedback response
 * 
 * @example
 * ```typescript
 * const feedback = await submitFeedback({
 *   post_id: "550e8400-e29b-41d4-a716-446655440000",
 *   problem_type_id: 1, // Playback Issues
 *   description: "The video keeps buffering every few minutes and sometimes freezes completely."
 * });
 * 
 * console.log(feedback.data.id); // Created feedback ID
 * console.log(feedback.data.problem_type.label); // "Playback Issues"
 * ```
 * 
 * @throws {AxiosError} HTTP 401 - Authentication required
 * @throws {AxiosError} HTTP 422 - Validation error (invalid post_id, problem_type_id, or description)
 */
export const submitFeedback = async (
  data: SubmitFeedbackRequest,
): Promise<SubmitFeedbackResponse> => {
  const response = await AXIOS_CLIENT.post<SubmitFeedbackResponse>(
    `${API_BASE_URL}/feedback/submit`,
    data,
  );
  return response.data;
};

