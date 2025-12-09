/**
 * Feedback API Module
 * 
 * Central export point for all feedback-related API functions, hooks, and utilities.
 * This follows the Facade Pattern to provide a clean interface to the feedback API.
 * 
 * Exports:
 * - feedbackApi: Low-level API client functions (fetchProblemTypes, submitFeedback)
 * - queryGetProblemTypes: Query hook for fetching problem types
 * - useMutationSubmitFeedback: Mutation hook for submitting feedback
 * - getErrorMessage: Utility for extracting user-friendly error messages
 * 
 * @example
 * ```typescript
 * // Import everything you need from one place
 * import { 
 *   useGetProblemTypes, 
 *   useMutationSubmitFeedback,
 *   getErrorMessage 
 * } from '@/apis/feedback';
 * 
 * function FeedbackForm({ postId }) {
 *   const { data: problemTypes } = useGetProblemTypes();
 *   const submitMutation = useMutationSubmitFeedback({ ... });
 *   // ...
 * }
 * ```
 */

// API client functions
export * from "./feedbackApi";

// Query hooks and key factories
export * from "./queryGetProblemTypes";

// Mutation hooks and utilities
export * from "./mutationSubmitFeedback";

