// Access environment variables using process.env or expo-constants extra
// Ensure EXPO_PUBLIC_API_URL is available in .env
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://api.example.com";

export const ENV = {
  API_URL,
  IS_DEV: process.env.NODE_ENV === "development",
};
