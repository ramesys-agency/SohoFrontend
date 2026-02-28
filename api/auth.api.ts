import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const authApi = {
  login: async (credentials: { email: string; password?: string }) => {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
    return response.data.data || response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) => {
    const response = await apiClient.post(API_ROUTES.AUTH.REGISTER, data);
    return response.data.data || response.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await apiClient.post(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      data,
    );
    return response.data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const response = await apiClient.post(API_ROUTES.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get(API_ROUTES.AUTH.ME);
    return response.data.data?.user || response.data.data || response.data;
  },
};
