/**
 * React Query Mutation for Submitting Feedback
 * 
 * This module provides a React Query mutation hook for submitting feedback.
 * It follows the Command Pattern by encapsulating feedback submission as an operation.
 * 
 * Features:
 * - Type-safe request and response handling
 * - Automatic error handling with typed error responses
 * - Configurable success/error callbacks
 * - Loading state management
 * 
 * @see feedbackApi.ts for the underlying API call
 * @see api.md for full API documentation
 */

import { useMutation } from "@tanstack/react-query";
import { submitFeedback } from "./feedbackApi";
import type { SubmitFeedbackRequest, SubmitFeedbackResponse } from "@/types/feedback";
import { AxiosError } from "axios";

/**
 * Error response structure from the API
 * 
 * The API returns validation errors in a specific format.
 * This interface helps with type-safe error handling.
 */
interface ApiErrorResponse {
  errors?: {
    post_id?: string[];
    problem_type_id?: string[];
    description?: string[];
  };
  message?: string;
}

/**
 * Configuration options for the submit feedback mutation
 * 
 * These options allow consumers to hook into the mutation lifecycle
 * for custom behavior like showing toasts, closing modals, or tracking analytics.
 */
interface UseSubmitFeedbackOptions {
  /**
   * Callback invoked when the mutation succeeds
   * 
   * Use this to:
   * - Show success toast/notification
   * - Close the feedback modal
   * - Track analytics event
   * 
   * @param data - The response data from successful submission
   */
  onSuccess?: (data: SubmitFeedbackResponse) => void;
  
  /**
   * Callback invoked when the mutation fails
   * 
   * Use this to:
   * - Show error toast/notification
   * - Log error to monitoring service
   * - Display field-specific validation errors
   * 
   * @param error - The error object from the failed request
   */
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}

/**
 * Extract a user-friendly error message from API error response
 * 
 * This helper function parses the error response and returns
 * an appropriate message for display to the user.
 * 
 * Priority:
 * 1. First validation error message
 * 2. Generic error message from response
 * 3. Default fallback message
 * 
 * @param error - The Axios error from the failed request
 * @returns User-friendly error message string
 * 
 * @example
 * ```typescript
 * const errorMessage = getErrorMessage(error);
 * toast.error(errorMessage);
 * ```
 */
export const getErrorMessage = (error: AxiosError<ApiErrorResponse>): string => {
  const responseData = error.response?.data;
  
  // Check for validation errors (HTTP 422)
  if (responseData?.errors) {
    const errors = responseData.errors;
    
    // Return first validation error found
    if (errors.post_id?.[0]) return errors.post_id[0];
    if (errors.problem_type_id?.[0]) return errors.problem_type_id[0];
    if (errors.description?.[0]) return errors.description[0];
  }
  
  // Check for generic message
  if (responseData?.message) {
    return responseData.message;
  }
  
  // Handle authentication errors (HTTP 401)
  if (error.response?.status === 401) {
    return "Authentication required. Please log in to submit feedback.";
  }
  
  // Default fallback for network errors or unknown issues
  return "Failed to submit feedback. Please try again.";
};

/**
 * Custom hook for submitting feedback
 * 
 * This mutation hook handles:
 * - Submitting feedback to the API
 * - Managing loading state during submission
 * - Handling success and error callbacks
 * - Providing type-safe access to mutation state
 * 
 * Requirements:
 * - User must be authenticated (Bearer token required)
 * - post_id must be a valid UUID of an existing post
 * - problem_type_id must be a valid problem type ID
 * - description must be 10-2000 characters
 * 
 * Error Handling:
 * - 401: Authentication required (user not logged in)
 * - 422: Validation errors (invalid data)
 * - Network errors: Connection issues
 * 
 * @param options - Configuration options for success/error callbacks
 * @returns Mutation object with mutate, mutateAsync, isPending, isError, etc.
 * 
 * @example
 * ```typescript
 * function FeedbackForm({ postId, onClose }) {
 *   const { t } = useTranslation();
 *   
 *   const submitMutation = useMutationSubmitFeedback({
 *     onSuccess: (data) => {
 *       toast.success(t("feedback.submitSuccess"));
 *       onClose();
 *     },
 *     onError: (error) => {
 *       const message = getErrorMessage(error);
 *       toast.error(message);
 *     }
 *   });
 * 
 *   const handleSubmit = () => {
 *     submitMutation.mutate({
 *       post_id: postId,
 *       problem_type_id: selectedProblemType,
 *       description: feedbackDescription
 *     });
 *   };
 * 
 *   return (
 *     <Button 
 *       onClick={handleSubmit}
 *       disabled={submitMutation.isPending}
 *     >
 *       {submitMutation.isPending ? "Submitting..." : "Submit"}
 *     </Button>
 *   );
 * }
 * ```
 */
export const useMutationSubmitFeedback = (options?: UseSubmitFeedbackOptions) => {
  return useMutation({
    /**
     * The mutation function that performs the API call
     * This is called when mutate() or mutateAsync() is invoked
     */
    mutationFn: (data: SubmitFeedbackRequest) => submitFeedback(data),
    
    /**
     * Called when the mutation succeeds
     * Invokes the custom onSuccess callback if provided
     */
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    
    /**
     * Called when the mutation fails
     * Logs the error and invokes the custom onError callback if provided
     * 
     * Error logging helps with debugging and monitoring
     */
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Failed to submit feedback:", error.response?.data || error.message);
      options?.onError?.(error);
    },
  });
};

