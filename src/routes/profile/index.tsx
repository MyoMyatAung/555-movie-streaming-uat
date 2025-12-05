/**
 * Profile Page Route Component
 * 
 * Main profile page that displays user information, quick actions,
 * watchlist links, and support options. Handles authentication state
 * and modal management for login/signup flows.
 * 
 * This refactored version follows SOLID principles:
 * - Single Responsibility: Each component has a single, well-defined purpose
 * - Open/Closed: Components are extensible without modification
 * - Liskov Substitution: Components can be substituted with their subtypes
 * - Interface Segregation: Interfaces are specific and focused
 * - Dependency Inversion: Depends on abstractions (types) not concrete implementations
 */

import { createFileRoute } from "@tanstack/react-router";
import HomeLayout from "@/components/common/layouts/HomeLayout";
import {
  ProfileHeader,
  QuickActionGrid,
  ListSection,
  AuthModals,
} from "@/components/common/profile";
import useAuth from "@/hooks/useAuth";
import { useProfileModals } from "@/hooks/useProfileModals";
import {
  QUICK_ACTIONS,
  WATCHLIST_LINKS,
  SUPPORT_LINKS,
} from "@/constants/profile";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
});

/**
 * Main Profile Page Component
 * 
 * Displays user profile with quick actions, watchlist, and support sections.
 * Manages authentication modals and user state.
 * 
 * The component is now much cleaner and follows SOLID principles:
 * - Delegates rendering to specialized components
 * - Uses custom hooks for state management
 * - Configuration is centralized in constants
 * - Each piece has a single, clear responsibility
 */
function RouteComponent() {
  const { isAuthenticated, user } = useAuth();

  // Modal state management hook - encapsulates all modal logic
  const {
    modalState,
    showForgotPassword,
    openModal,
    closeModal,
    toggleForgotPassword,
    handleLoginToSignup,
    handleSignupToLogin,
  } = useProfileModals();

  return (
    <HomeLayout noHeader={true}>
      <div className="relative h-full">
        <div className="flex h-full flex-col px-6 pt-8 pb-10 text-white">
          {/* Profile Header - handles both authenticated and unauthenticated states */}
          <ProfileHeader
            isAuthenticated={isAuthenticated}
            user={user}
            onLoginClick={() => openModal("login")}
          />

          {/* Quick Actions Grid */}
          <QuickActionGrid actions={QUICK_ACTIONS} className="mt-8" />

          {/* Watchlist and Support Sections */}
          <div className="mt-10 flex flex-col gap-6">
            <ListSection items={WATCHLIST_LINKS} />
            <ListSection items={SUPPORT_LINKS} />
          </div>
        </div>
      </div>

      {/* Authentication Modals - login and signup */}
      <AuthModals
        modalState={modalState}
        showForgotPassword={showForgotPassword}
        onLoginClose={() => closeModal("login")}
        onSignupClose={() => closeModal("signup")}
        onForgotPasswordToggle={toggleForgotPassword}
        onLoginToSignup={handleLoginToSignup}
        onSignupToLogin={handleSignupToLogin}
      />
    </HomeLayout>
  );
}
