import { tokenStorage } from "@/api/secureStore";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  // add other user fields
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
  updateUser: (user: User) => void;
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

  updateUser: (user) => {
    set({ user });
  },

  setTokens: async (accessToken, refreshToken) => {
    await tokenStorage.setAccessToken(accessToken);
    await tokenStorage.setRefreshToken(refreshToken);
    set({ accessToken });
  },

  hydrate: async () => {
    try {
      set({ isLoading: true });
      const accessToken = await tokenStorage.getAccessToken();
      const refreshToken = await tokenStorage.getRefreshToken();

      if (accessToken && refreshToken) {
        // Here, you might want to validate the token or fetch user profile
        // For now, we assume valid if token exists, but ideally verify with API
        // The axios interceptor will handle 401 if invalid
        set({ accessToken, isAuthenticated: true });

        // Note: User data isn't persisted here explicitly to secure store in this simple version
        // You might want to fetch /me endpoint here if user data is missing
      } else {
        set({ isAuthenticated: false, accessToken: null });
      }
    } catch (error) {
      console.error("Hydration failed:", error);
      set({ isAuthenticated: false, accessToken: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
