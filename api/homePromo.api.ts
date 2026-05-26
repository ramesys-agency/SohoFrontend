import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const homePromoApi = {
  getSection: async () => {
    const response = await apiClient.get(API_ROUTES.HOME_PROMO.GET);
    return response.data;
  },
};
