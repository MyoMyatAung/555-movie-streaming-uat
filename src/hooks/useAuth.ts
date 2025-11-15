import { useCallback, useEffect, useRef } from "react";

import { useLogin } from "@/apis/auth/mutationLogin";
import { useLogout } from "@/apis/auth/mutationLogout";
import { useGetMe } from "@/apis/auth/queryGetMe";
import { useAuthStore } from "@/stores/useAuthStore";
import type { LoginCredentials, User } from "@/types/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export interface UseAuthReturn {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;

  // Authentication methods
  passwordLogin: (credentials: LoginCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;

  // Token methods
  getAccessToken: () => string | null;
  isTokenExpired: () => boolean;
}

/**
 * Custom hook to access authentication functionality
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user, login, logout } = useAuth();
 *
 * if (isAuthenticated) {
 *   return <div>Welcome, {user?.name}!</div>
 * }
 *
 * return <button onClick={() => login({ email, password })}>Login</button>
 * ```
 */
export function useAuth(): UseAuthReturn {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {
    user: storedUser,
    tokens,
    isAuthenticated,
    setUser,
    setTokens,
    clearAuth,
    getAccessToken,
    isTokenExpired,
    setRecaptchaToken,
  } = useAuthStore();

  // Fetch user profile if we have a token but no user
  const {
    user: fetchedUser,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useGetMe({
    token: getAccessToken(),
  });

  // Login mutation
  const {
    mutateAsync: loginMutation,
    isPending: isLoggingIn,
    error: loginError,
  } = useLogin({
    onSuccess: async (response) => {
      console.log({ response });
      // Store tokens first so they're available for the next API call
      const authTokens = {
        access_token: response.data.access_token,
        token_type: response.data.token_type || "",
        expires_in: response.data.expires_in || 0,
      };
      setTokens(authTokens);

      // Fetch user profile with the new token
      try {
        const { data: userResponse } = await refetchUser();

        setTimeout(() => {
          setRecaptchaToken(null);
        }, 1000);

        if (userResponse?.data) {
          // Store user data (tokens are already stored)
          setUser(userResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        clearAuth();
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      clearAuth();
    },
  });

  // Logout mutation
  const { mutateAsync: logoutMutation } = useLogout({
    onSuccess: () => {
      clearAuth();
    },
  });

  // Sync fetched user with store if not already set
  useEffect(() => {
    if (fetchedUser && tokens) {
      setUser(fetchedUser);
    }
  }, [fetchedUser, tokens, setUser]);

  // Check token expiration on mount and periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (isAuthenticated && isTokenExpired()) {
        console.warn("Token expired, logging out...");
        clearAuth();
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isTokenExpired, clearAuth]);

  // Track previous authentication state to detect changes
  const prevIsAuthenticatedRef = useRef(isAuthenticated);

  // Invalidate places queries when authentication state changes from false to true
  useEffect(() => {
    const wasAuthenticated = prevIsAuthenticatedRef.current;
    const isNowAuthenticated = isAuthenticated && storedUser;

    if (!wasAuthenticated && isNowAuthenticated) {
      // User just became authenticated, invalidate places queries
    }

    // Update the ref for next comparison
    prevIsAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated, storedUser, queryClient]);

  const passwordLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        await loginMutation(credentials);
        toast.success(t("auth.login.loginSuccess"));
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [loginMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation();
  }, [logoutMutation]);

  const isLoading = isLoggingIn || isLoadingUser;
  const error = loginError?.message || null;

  return {
    isAuthenticated,
    isLoading,
    user: storedUser,
    error,
    login: passwordLogin, // Alias for backward compatibility
    passwordLogin,
    logout,
    getAccessToken,
    isTokenExpired,
  };
}

export default useAuth;
