import { authApi } from "@/api/auth.api";
import { tokenStorage } from "@/store/secureStore";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;

  login: (
    user: User,
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  isLoading: true,

  login: async (user, accessToken, refreshToken) => {
    // 1. Store tokens securely
    await tokenStorage.setAccessToken(accessToken);
    await tokenStorage.setRefreshToken(refreshToken);

    // 2. Update state
    set({
      user,
      isAuthenticated: true,
      accessToken,
      isLoading: false,
    });
  },

  logout: async () => {
    // 1. Clear secure storage
    await tokenStorage.clearTokens();

    // 2. Reset state
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      isLoading: false,
    });
  },

  updateUser: (userData: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : (userData as User),
    }));
  },

  setTokens: async (accessToken, refreshToken) => {
    await tokenStorage.setAccessToken(accessToken);
    await tokenStorage.setRefreshToken(refreshToken);
    set({ accessToken });
  },

  hydrate: async () => {
    // If login() already ran and set the user, don't overwrite it.
    // This prevents a race where hydrate() resumes after login() stores tokens
    // and then fetches a stale profile that clobbers the freshly-set user.
    if (get().isAuthenticated) {
      set({ isLoading: false });
      return;
    }
    try {
      set({ isLoading: true });
      const accessToken = await tokenStorage.getAccessToken();
      const refreshToken = await tokenStorage.getRefreshToken();

      if (accessToken && refreshToken) {
        // Set token in state first so axios interceptor can attach it to /me request
        set({ accessToken });

        // Validate token server-side and fetch fresh user data
        const user = await authApi.getProfile();
        set({ user, isAuthenticated: true });
      } else {
        set({ isAuthenticated: false, accessToken: null, user: null });
      }
    } catch (error: any) {
      // 401 errors are handled upstream by the axios interceptor:
      //   → It tries the refresh token automatically.
      //   → If refresh also fails, interceptor calls logout() which clears SecureStore + state.
      // Here we only handle remaining cases:
      const isNetworkError = !error.response; // no response = offline / timeout / DNS failure

      if (isNetworkError) {
        // Don't punish the user for being offline — tokens may still be valid.
        // Keep accessToken in state so the interceptor can retry on next API call.
        // Block access to the app (isAuthenticated: false) but preserve tokens.
        console.warn("Hydration skipped: network unavailable");
        set({ isAuthenticated: false });
      } else {
        // Unexpected server error (5xx, etc.) — clear everything to be safe.
        console.error("Hydration failed:", error);
        set({ isAuthenticated: false, accessToken: null, user: null });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
