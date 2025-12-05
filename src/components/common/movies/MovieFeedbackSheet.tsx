/**
 * MovieFeedbackSheet Component
 * 
 * A modal sheet component that allows users to submit feedback about a movie/post.
 * Implements a two-step feedback flow:
 * 1. Select a problem type from available options
 * 2. Provide a detailed description of the issue
 * 
 * Features:
 * - Fetches problem types from API with loading/error states
 * - Validates input before submission
 * - Handles API errors with user-friendly messages
 * - Supports internationalization (i18n)
 * - Proper cleanup on close/cancel
 * 
 * Architecture:
 * - Uses React Query for data fetching and mutations
 * - Follows controlled component pattern for form inputs
 * - Implements proper error boundaries and loading states
 * 
 * @see api.md for API documentation
 * @see feedbackApi.ts for API client implementation
 */

import SheetModal from "@/components/common/SheetModal";
import { Button } from "@/components/ui/button";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  useGetProblemTypes, 
  useMutationSubmitFeedback,
  getErrorMessage 
} from "@/apis/feedback";
import { FEEDBACK_DESCRIPTION_CONSTRAINTS } from "@/types/feedback";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Props for the MovieFeedbackSheet component
 * 
 * @property postId - The UUID of the post/movie to submit feedback for
 * @property openFeedbackSheet - Controls the visibility of the modal
 * @property setOpenFeedbackSheet - Function to update the modal visibility
 */
interface MovieFeedbackSheetProps {
  /** UUID of the post/movie being reported */
  postId: string;
  /** Whether the feedback sheet is currently open */
  openFeedbackSheet: boolean;
  /** Callback to update the open state */
  setOpenFeedbackSheet: Dispatch<SetStateAction<boolean>>;
}

/**
 * Represents a problem type option in the UI
 * 
 * This interface maps the API response to a format suitable for
 * rendering in the problem type selector.
 */
interface ProblemTypeOption {
  /** Unique identifier (derived from index for now since API doesn't return ID) */
  id: number;
  /** Machine-readable name from API */
  name: string;
  /** Human-readable description for display */
  description: string;
}

/**
 * Loading skeleton for problem type buttons
 * 
 * Displays placeholder content while problem types are being fetched.
 * Uses consistent sizing with actual buttons for smooth loading transition.
 */
function ProblemTypesSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Render 6 skeleton items to match typical number of problem types */}
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton 
          key={index} 
          className="h-12 w-24 rounded-lg bg-gray-700" 
        />
      ))}
    </div>
  );
}

/**
 * Error display component for problem types loading failure
 * 
 * Shows an error message with a retry button when problem types
 * fail to load from the API.
 * 
 * @param message - Error message to display
 * @param onRetry - Callback to retry loading problem types
 */
function ProblemTypesError({ 
  message, 
  onRetry 
}: { 
  message: string; 
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center gap-3 py-4 text-center">
      <p className="text-sm text-red-400">{message}</p>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onRetry}
        className="border-gray-600 bg-transparent text-white hover:bg-gray-700"
      >
        {t("movie-detail.error.refresh")}
      </Button>
    </div>
  );
}

/**
 * MovieFeedbackSheet Component
 * 
 * Main component for the feedback submission modal.
 * Handles the complete feedback flow from problem selection to submission.
 * 
 * State Management:
 * - selectedProblemType: Currently selected problem type (null = none selected)
 * - feedbackDetail: User's description of the issue
 * 
 * Data Flow:
 * 1. On mount/open: Fetch problem types from API
 * 2. User selects a problem type
 * 3. User enters description (min 10 characters)
 * 4. User submits feedback
 * 5. On success: Close modal and reset state
 * 6. On error: Display error message
 * 
 * @param props - Component props
 * @returns JSX element for the feedback sheet
 */
export function MovieFeedbackSheet({
  postId,
  openFeedbackSheet,
  setOpenFeedbackSheet,
}: MovieFeedbackSheetProps) {
  const { t } = useTranslation();
  
  // ============================================
  // State Management
  // ============================================
  
  /** Selected problem type (null when nothing is selected) */
  const [selectedProblemType, setSelectedProblemType] = useState<ProblemTypeOption | null>(null);
  
  /** User's description of the issue */
  const [feedbackDetail, setFeedbackDetail] = useState<string>("");
  
  /** Error message to display (for submission errors) */
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ============================================
  // API Hooks
  // ============================================
  
  /**
   * Fetch available problem types from API
   * 
   * - Cached for 5 minutes to reduce API calls
   * - Automatically refetches on window focus
   * - Returns loading and error states
   */
  const { 
    data: problemTypesResponse, 
    isLoading: isLoadingProblemTypes,
    isError: isProblemTypesError,
    error: problemTypesError,
    refetch: refetchProblemTypes
  } = useGetProblemTypes();
  
  /**
   * Mutation hook for submitting feedback
   * 
   * Configured with success and error handlers:
   * - On success: Close modal and reset form
   * - On error: Display user-friendly error message
   */
  const submitFeedbackMutation = useMutationSubmitFeedback({
    onSuccess: () => {
      // Close the modal and reset all state
      handleClose();
    },
    onError: (error) => {
      // Extract and display user-friendly error message
      const message = getErrorMessage(error);
      setErrorMessage(message);
    }
  });

  // ============================================
  // Derived State
  // ============================================
  
  /**
   * Transform API response into displayable problem type options
   * 
   * The API returns { name, description } but we need to track
   * selection state, so we add a generated ID based on index + 1
   * (API problem type IDs start from 1).
   */
  const problemTypes: ProblemTypeOption[] = problemTypesResponse?.data?.map(
    (type, index) => ({
      id: index + 1, // Problem type IDs start from 1 in the API
      name: type.name,
      description: type.description,
    })
  ) ?? [];
  
  /**
   * Validate if the form can be submitted
   * 
   * Requirements:
   * - A problem type must be selected
   * - Description must meet minimum length requirement
   * - No active submission in progress
   */
  const canSubmit = 
    selectedProblemType !== null && 
    feedbackDetail.trim().length >= FEEDBACK_DESCRIPTION_CONSTRAINTS.MIN_LENGTH &&
    !submitFeedbackMutation.isPending;
  
  /**
   * Character count for description validation feedback
   */
  const descriptionLength = feedbackDetail.trim().length;
  const isDescriptionValid = descriptionLength >= FEEDBACK_DESCRIPTION_CONSTRAINTS.MIN_LENGTH;

  // ============================================
  // Event Handlers
  // ============================================
  
  /**
   * Handle problem type selection
   * 
   * Updates the selected problem type and clears any previous error message.
   * 
   * @param problemType - The selected problem type option
   */
  const handleProblemTypeSelect = useCallback((problemType: ProblemTypeOption) => {
    setSelectedProblemType(problemType);
    setErrorMessage(""); // Clear any previous errors when selection changes
  }, []);
  
  /**
   * Handle description input change
   * 
   * Updates the feedback detail and clears any previous error message.
   * Enforces maximum length constraint.
   * 
   * @param event - Input change event
   */
  const handleDescriptionChange = useCallback((
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    
    // Enforce maximum length
    if (value.length <= FEEDBACK_DESCRIPTION_CONSTRAINTS.MAX_LENGTH) {
      setFeedbackDetail(value);
      setErrorMessage(""); // Clear any previous errors when typing
    }
  }, []);
  
  /**
   * Reset all form state to initial values
   * 
   * Called when closing the modal or after successful submission.
   */
  const resetForm = useCallback(() => {
    setSelectedProblemType(null);
    setFeedbackDetail("");
    setErrorMessage("");
  }, []);
  
  /**
   * Handle modal close/cancel
   * 
   * Closes the modal and resets all form state.
   * Called on cancel button click, backdrop click, or successful submission.
   */
  const handleClose = useCallback(() => {
    setOpenFeedbackSheet(false);
    resetForm();
  }, [setOpenFeedbackSheet, resetForm]);
  
  /**
   * Handle feedback submission
   * 
   * Validates the form data and submits feedback to the API.
   * On success, the modal closes automatically via the onSuccess callback.
   * On error, an error message is displayed in the form.
   */
  const handleSubmit = useCallback(() => {
    // Validate required fields
    if (!selectedProblemType) {
      setErrorMessage(t("movie-detail.feedback.selectProblemType"));
      return;
    }
    
    if (!isDescriptionValid) {
      setErrorMessage(
        t("movie-detail.feedback.descriptionMinLength", { 
          min: FEEDBACK_DESCRIPTION_CONSTRAINTS.MIN_LENGTH 
        })
      );
      return;
    }
    
    // Clear any previous errors and submit
    setErrorMessage("");
    
    submitFeedbackMutation.mutate({
      post_id: postId,
      problem_type_id: selectedProblemType.id,
      description: feedbackDetail.trim(),
    });
  }, [
    selectedProblemType, 
    feedbackDetail, 
    postId, 
    isDescriptionValid,
    submitFeedbackMutation, 
    t
  ]);

  // ============================================
  // Effects
  // ============================================
  
  /**
   * Reset form when modal is closed externally
   * 
   * Ensures form state is clean when the modal is reopened.
   */
  useEffect(() => {
    if (!openFeedbackSheet) {
      resetForm();
    }
  }, [openFeedbackSheet, resetForm]);

  // ============================================
  // Render
  // ============================================
  
  return (
    <SheetModal
      showModal={openFeedbackSheet}
      setShowModal={setOpenFeedbackSheet}
      title={t("movie-detail.issues.header")}
      onClose={handleClose}
      snapPoints={[0.98]}
      containerClassName="!bg-gray-900"
    >
      <div className="flex flex-col gap-6 p-4">
        {/* 
          Problem Type Selection Section
          
          Displays a grid of selectable problem type buttons.
          Handles loading, error, and success states appropriately.
        */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-white">
            {t("movie-detail.issues.title")}
          </h3>
          
          {/* Loading State */}
          {isLoadingProblemTypes && <ProblemTypesSkeleton />}
          
          {/* Error State */}
          {isProblemTypesError && (
            <ProblemTypesError 
              message={
                problemTypesError instanceof Error 
                  ? problemTypesError.message 
                  : t("movie-detail.feedback.loadProblemTypesError")
              }
              onRetry={() => refetchProblemTypes()}
            />
          )}
          
          {/* Success State - Display Problem Type Options */}
          {!isLoadingProblemTypes && !isProblemTypesError && (
            <div className="flex flex-wrap items-center gap-3">
              {problemTypes.map((problemType) => (
                <button
                  key={problemType.id}
                  onClick={() => handleProblemTypeSelect(problemType)}
                  className={`rounded-lg border px-4 py-3 text-sm transition-colors ${
                    selectedProblemType?.id === problemType.id
                      ? "border-primary-blue bg-primary-blue text-white"
                      : "border-gray-700 bg-gray-800 text-white hover:border-gray-600"
                  }`}
                  type="button"
                  aria-pressed={selectedProblemType?.id === problemType.id}
                >
                  {problemType.description}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 
          Feedback Description Section
          
          A textarea for users to provide detailed descriptions of their issue.
          Shows character count and validation status.
        */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">
              {t("movie-detail.issues.description")}{" "}
              <span className="text-gray-500">
                ({t("movie-detail.issues.required")})
              </span>
            </h3>
            
            {/* Character count indicator */}
            <span className={`text-xs ${
              isDescriptionValid ? "text-gray-500" : "text-yellow-500"
            }`}>
              {descriptionLength}/{FEEDBACK_DESCRIPTION_CONSTRAINTS.MAX_LENGTH}
            </span>
          </div>
          
          <textarea
            value={feedbackDetail}
            onChange={handleDescriptionChange}
            placeholder={t("movie-detail.feedback.placeholder")}
            className={`focus:border-primary-blue min-h-[120px] rounded-lg border p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none ${
              feedbackDetail.length > 0 && !isDescriptionValid
                ? "border-yellow-500 bg-gray-800"
                : "border-gray-700 bg-gray-800"
            }`}
            rows={5}
            aria-describedby="description-hint"
          />
          
          {/* Validation hint */}
          {feedbackDetail.length > 0 && !isDescriptionValid && (
            <p id="description-hint" className="text-xs text-yellow-500">
              {t("movie-detail.feedback.descriptionMinLength", { 
                min: FEEDBACK_DESCRIPTION_CONSTRAINTS.MIN_LENGTH 
              })}
            </p>
          )}
        </div>

        {/* 
          Error Message Display
          
          Shows any submission errors or validation errors.
        */}
        {errorMessage && (
          <div className="rounded-lg bg-red-900/20 p-3 text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        {/* 
          Submit Button Section
          
          Displays a submit button with loading state and disabled state handling.
        */}
        <div className="flex gap-3">
          <Button
            className="bg-primary-blue flex-1 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!canSubmit}
            type="button"
          >
            {submitFeedbackMutation.isPending 
              ? t("movie-detail.feedback.submitting")
              : t("movie-detail.actions.submit")
            }
          </Button>
        </div>
      </div>
    </SheetModal>
  );
}
