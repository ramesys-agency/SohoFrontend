import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get(API_ROUTES.USERS.PROFILE);
    return response.data.data || response.data;
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.put(API_ROUTES.USERS.PROFILE, data);
    return response.data.data || response.data;
  },
  updateAvatar: async (formData: FormData) => {
    const response = await apiClient.patch(API_ROUTES.USERS.AVATAR, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data || response.data;
  },
};
