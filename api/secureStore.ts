import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "soho_access_token";
// Using a separate key for refresh token if needed, or storing them together
const REFRESH_TOKEN_KEY = "soho_refresh_token";

// SecureStore is not supported on web, use localStorage or cookies as fallback if needed
// For this React Native focus, we will focus on native support but add a web fallback for dev
const isWeb = Platform.OS === "web";

export const secureStorage = {
  async setItem(key: string, value: string) {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async getItem(key: string) {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async deleteItem(key: string) {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const tokenStorage = {
  async setAccessToken(token: string) {
    await secureStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  async getAccessToken() {
    return await secureStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async removeAccessToken() {
    await secureStorage.deleteItem(ACCESS_TOKEN_KEY);
  },

  async setRefreshToken(token: string) {
    await secureStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  async getRefreshToken() {
    return await secureStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async removeRefreshToken() {
    await secureStorage.deleteItem(REFRESH_TOKEN_KEY);
  },

  async clearTokens() {
    await this.removeAccessToken();
    await this.removeRefreshToken();
  },
};
