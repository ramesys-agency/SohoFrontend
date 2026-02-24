import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const collectionApi = {
  getCollections: async (params?: Record<string, any>) => {
    const response = await apiClient.get(
      API_ROUTES.COLLECTION.GET_COLLECTIONS,
      { params },
    );
    return response.data.data || response.data;
  },
};
