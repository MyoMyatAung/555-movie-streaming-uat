/**
 * ProfileHeader Component
 * 
 * A composite component that displays either authenticated or unauthenticated
 * header based on user authentication status.
 * 
 * This component demonstrates the Strategy Pattern by choosing which header
 * component to render based on the authentication state.
 * 
 * @example
 * ```tsx
 * <ProfileHeader
 *   isAuthenticated={isAuthenticated}
 *   user={user}
 *   onLoginClick={handleLogin}
 * />
 * ```
 */

import { AuthenticatedHeader } from "./AuthenticatedHeader";
import { UnauthenticatedHeader } from "./UnauthenticatedHeader";
import type { User } from "@/types/auth";

interface ProfileHeaderProps {
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Current user data (null if not authenticated) */
  user: User | null;
  /** Callback when user clicks login button (unauthenticated state) */
  onLoginClick: () => void;
}

/**
 * Renders the appropriate header component based on authentication status
 */
export const ProfileHeader = ({
  isAuthenticated,
  user,
  onLoginClick,
}: ProfileHeaderProps) => {
  if (isAuthenticated) {
    return <AuthenticatedHeader user={user} />;
  }

  return <UnauthenticatedHeader onLoginClick={onLoginClick} />;
};

