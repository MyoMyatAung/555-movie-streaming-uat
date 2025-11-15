import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { AuthTokens, User } from "@/types/auth";

interface AuthState {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  recaptchaToken: string | null;

  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void; // Add this
  setTokens: (tokens: AuthTokens | null) => void;
  setAuth: (user: User, tokens: AuthTokens) => void;
  clearAuth: () => void;
  setRecaptchaToken: (token: string | null) => void;

  // Token helpers
  getRecaptchaToken: () => string | null;
  getAccessToken: () => string | null;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        tokens: null,
        isAuthenticated: false,
        recaptchaToken: "",

        // Actions
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
          }),

        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),

        setTokens: (tokens) =>
          set({
            tokens,
          }),

        setAuth: (user, tokens) =>
          set({
            user,
            tokens,
            isAuthenticated: true,
          }),

        clearAuth: () =>
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
          }),

        setRecaptchaToken: (token) =>
          set({
            recaptchaToken: token,
          }),

        // Token helpers
        getAccessToken: () => {
          const state = get();
          return state.tokens?.access_token || null;
        },

        getRecaptchaToken: () => {
          const state = get();
          return state.recaptchaToken || null;
        },

        isTokenExpired: () => {
          return false;
          // const state = get();
          // console.log({ tokens: state.tokens });
          // if (!state.tokens?.expires_in) return true;
          // console.log({ expirationTime: state.tokens?.expires_in * 1000 });

          // const expirationTime = state.tokens.expires_in * 1000; // Convert to milliseconds
          // const currentTime = Date.now();

          // return currentTime >= expirationTime;
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          tokens: state.tokens,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  ),
);

export default useAuthStore;
