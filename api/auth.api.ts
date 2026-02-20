import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const authApi = {
  login: async (credentials: { email: string; password?: string }) => {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
    return response.data.data || response.data;
  },
  // Add other authentication API calls here, e.g., register, logout, refreshToken
};
