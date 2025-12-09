/**
 * Feedback Type Definitions
 * 
 * These types align with the API response structure from:
 * - GET /api/v1/problem-types/list (fetch problem types)
 * - POST /api/v1/feedback/submit (submit feedback)
 * 
 * @see api.md for full API documentation
 */

/**
 * Problem Type Definition
 * 
 * Represents a category of issues users can report.
 * Problem types are managed by administrators and displayed in the feedback form.
 * 
 * @example
 * {
 *   id: 1,
 *   name: "playback_issues",
 *   label: "Playback Issues",
 *   description: "Video playback problems (buffering, freezing, etc.)"
 * }
 */
export interface ProblemType {
  /** Unique identifier for the problem type */
  id: number;
  /** Machine-readable name (e.g., "playback_issues", "missing_resources") */
  name: string;
  /** Human-readable label for display (optional, may not be in API response) */
  label?: string;
  /** Description of what this problem type covers */
  description: string;
}

/**
 * Response structure for fetching problem types list
 * 
 * GET /api/v1/problem-types/list
 * 
 * Note: The API returns only name and description fields.
 * The id and label may need to be derived or added client-side.
 */
export interface ProblemTypesListResponse {
  status: boolean;
  message: string;
  data: Array<{
    name: string;
    description: string;
  }>;
}

/**
 * Request payload for submitting feedback
 * 
 * POST /api/v1/feedback/submit
 * 
 * @example
 * {
 *   post_id: "550e8400-e29b-41d4-a716-446655440000",
 *   problem_type_id: 1,
 *   description: "The video keeps buffering..."
 * }
 */
export interface SubmitFeedbackRequest {
  /** UUID of the post/film being reported */
  post_id: string;
  /** ID of the selected problem type */
  problem_type_id: number;
  /** Detailed description of the issue (10-2000 characters) */
  description: string;
}

/**
 * Nested problem type in feedback submission response
 */
export interface FeedbackProblemType {
  id: number;
  name: string;
  label: string;
}

/**
 * Feedback data returned after successful submission
 */
export interface FeedbackData {
  /** Unique identifier for the feedback */
  id: string;
  /** UUID of the post/film reported */
  post_id: string;
  /** ID of the problem type selected */
  problem_type_id: number;
  /** Problem type details */
  problem_type: FeedbackProblemType;
  /** User's description of the issue */
  description: string;
  /** Timestamp when feedback was created */
  created_at: string;
  /** Timestamp when feedback was last updated */
  updated_at: string;
}

/**
 * Response structure for submitting feedback
 * 
 * POST /api/v1/feedback/submit
 */
export interface SubmitFeedbackResponse {
  status: boolean;
  message: string;
  data: FeedbackData;
}

/**
 * Validation error response structure
 * 
 * Returned when request validation fails (HTTP 422)
 */
export interface FeedbackValidationError {
  errors: {
    post_id?: string[];
    problem_type_id?: string[];
    description?: string[];
  };
}

/**
 * Problem type IDs as defined in the API
 * 
 * These are the default problem type IDs. They may vary if the
 * database has been modified by administrators.
 * 
 * @see api.md for full list of problem types
 */
export const PROBLEM_TYPE_IDS = {
  PLAYBACK_ISSUES: 1,
  INCOMPLETE_EPISODES: 2,
  MISSING_RESOURCES: 3,
  INCORRECT_INFORMATION: 4,
  INACCURATE_CATEGORY: 5,
  BUG_ERROR: 6,
} as const;

/**
 * Minimum and maximum lengths for feedback description
 * as defined by the API validation rules
 */
export const FEEDBACK_DESCRIPTION_CONSTRAINTS = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 2000,
} as const;

