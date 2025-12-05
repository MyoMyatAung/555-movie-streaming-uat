/**
 * Custom hook for managing profile page modals
 * 
 * This hook encapsulates all modal state management logic,
 * following the Single Responsibility Principle by separating
 * modal concerns from the main component.
 * 
 * @returns Modal state and handlers
 */

import { useState, useCallback } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ModalState, ModalKey } from "@/types/profile-ui";

export interface UseProfileModalsReturn {
  /** Current modal state */
  modalState: ModalState;
  /** Whether forgot password view is shown */
  showForgotPassword: boolean;
  /** Open a specific modal */
  openModal: (modalKey: ModalKey) => void;
  /** Close a specific modal */
  closeModal: (modalKey: ModalKey) => void;
  /** Toggle forgot password view */
  toggleForgotPassword: (show: boolean) => void;
  /** Handle login to signup transition */
  handleLoginToSignup: () => void;
  /** Handle signup to login transition */
  handleSignupToLogin: () => void;
}

/**
 * Initial modal state - all modals closed by default
 */
const INITIAL_MODAL_STATE: ModalState = {
  language: false,
  share: false,
  login: false,
  signup: false,
};

/**
 * Hook for managing profile page modals
 */
export const useProfileModals = (): UseProfileModalsReturn => {
  const [modalState, setModalState] = useState<ModalState>(INITIAL_MODAL_STATE);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { setRecaptchaToken } = useAuthStore();

  /**
   * Opens a specific modal and clears recaptcha token
   */
  const openModal = useCallback((modalKey: ModalKey) => {
    setModalState((prev) => ({ ...prev, [modalKey]: true }));
  }, []);

  /**
   * Closes a specific modal and clears recaptcha token
   */
  const closeModal = useCallback(
    (modalKey: ModalKey) => {
      setModalState((prev) => ({ ...prev, [modalKey]: false }));
      // Clear recaptcha token when closing authentication modals
      if (modalKey === "login" || modalKey === "signup") {
        setRecaptchaToken(null);
      }
    },
    [setRecaptchaToken]
  );

  /**
   * Toggles the forgot password view
   */
  const toggleForgotPassword = useCallback((show: boolean) => {
    setShowForgotPassword(show);
  }, []);

  /**
   * Handles transition from login modal to signup modal
   */
  const handleLoginToSignup = useCallback(() => {
    setModalState((prev) => ({ ...prev, login: false, signup: true }));
  }, []);

  /**
   * Handles transition from signup modal to login modal
   */
  const handleSignupToLogin = useCallback(() => {
    setModalState((prev) => ({ ...prev, login: true, signup: false }));
    setShowForgotPassword(false);
  }, []);

  return {
    modalState,
    showForgotPassword,
    openModal,
    closeModal,
    toggleForgotPassword,
    handleLoginToSignup,
    handleSignupToLogin,
  };
};

