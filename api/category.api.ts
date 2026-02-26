import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const categoryApi = {
  getCategories: async (params?: Record<string, any>) => {
    const response = await apiClient.get(API_ROUTES.CATEGORY.GET_CATEGORIES, {
      params,
    });
    return response.data.data || response.data;
  },

  getPageTitle: async (params: Record<string, any>) => {
    const response = await apiClient.get(API_ROUTES.CATEGORY.GET_PAGE_TITLE, {
      params,
    });
    return response.data.data || response.data;
  },
};
