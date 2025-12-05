/**
 * AuthModals Component
 * 
 * Manages authentication modals (login, signup, forgot password).
 * Encapsulates all modal rendering logic in a single component.
 * 
 * This component follows the Single Responsibility Principle by handling
 * only the authentication modal rendering and state management integration.
 * 
 * @example
 * ```tsx
 * <AuthModals
 *   modalState={modalState}
 *   showForgotPassword={showForgotPassword}
 *   onLoginClose={handleLoginClose}
 *   onSignupClose={handleSignupClose}
 *   onForgotPasswordToggle={handleForgotPasswordToggle}
 *   onLoginToSignup={handleLoginToSignup}
 *   onSignupToLogin={handleSignupToLogin}
 * />
 * ```
 */

import ForgotPassword from "@/components/common/auth/ForgotPassword";
import { LoginForm } from "@/components/common/auth/LoginForm";
import RegisterForm from "@/components/common/auth/RegisterForm";
import SheetModal from "@/components/common/SheetModal";
import type { ModalState } from "@/types/profile-ui";

interface AuthModalsProps {
  /** Current modal state */
  modalState: ModalState;
  /** Whether forgot password view is shown */
  showForgotPassword: boolean;
  /** Handler for closing login modal */
  onLoginClose: () => void;
  /** Handler for closing signup modal */
  onSignupClose: () => void;
  /** Handler for toggling forgot password view */
  onForgotPasswordToggle: (show: boolean) => void;
  /** Handler for transitioning from login to signup */
  onLoginToSignup: () => void;
  /** Handler for transitioning from signup to login */
  onSignupToLogin: () => void;
}

/**
 * Renders login and signup modals with proper state management
 */
export const AuthModals = ({
  modalState,
  showForgotPassword,
  onLoginClose,
  onSignupClose,
  onForgotPasswordToggle,
  onLoginToSignup,
  onSignupToLogin,
}: AuthModalsProps) => {
  return (
    <>
      {/* Login Modal */}
      <SheetModal
        detent="content"
        showModal={modalState.login}
        setShowModal={(value) => {
          if (!value) {
            onLoginClose();
          }
        }}
        containerClassName="!bg-dark-gray"
      >
        {showForgotPassword ? (
          <ForgotPassword
            onClose={() => onForgotPasswordToggle(false)}
            onLogin={() => onForgotPasswordToggle(false)}
          />
        ) : (
          <LoginForm
            onClose={onLoginClose}
            onForgotPassword={() => onForgotPasswordToggle(true)}
            onSignUp={onLoginToSignup}
          />
        )}
      </SheetModal>

      {/* Signup Modal */}
      <SheetModal
        detent="content"
        key="signup"
        showModal={modalState.signup}
        setShowModal={(value) => {
          if (!value) {
            onSignupClose();
          }
        }}
        snapPoints={[0, 1]}
        containerClassName="bg-dark-gray! overflow-y-auto"
      >
        {modalState.signup && (
          <RegisterForm
            onSignIn={onSignupToLogin}
            onBack={onSignupToLogin}
            onClose={onSignupClose}
          />
        )}
      </SheetModal>
    </>
  );
};

