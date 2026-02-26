import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const productApi = {
  getProducts: async (params?: Record<string, any>) => {
    const response = await apiClient.get(API_ROUTES.PRODUCT.GET_PRODUCTS, {
      params,
    });
    return response.data.data || response.data;
  },

  getProductById: async (id: string) => {
    const response = await apiClient.get(API_ROUTES.PRODUCTS.DETAILS(id));
    return response.data.data || response.data;
  },
};
