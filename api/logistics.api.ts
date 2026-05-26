import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const logisticsApi = {
  getDivisions: async () => {
    const response = await apiClient.get(API_ROUTES.LOGISTICS.DIVISIONS);
    return response.data.data || response.data;
  },
  getDistricts: async (divisionId: string) => {
    const response = await apiClient.get(
      `${API_ROUTES.LOGISTICS.DISTRICTS}?divisionId=${divisionId}`,
    );
    return response.data.data || response.data;
  },
  getThanas: async (districtId: string) => {
    const response = await apiClient.get(
      `${API_ROUTES.LOGISTICS.THANAS}?districtId=${districtId}`,
    );
    return response.data.data || response.data;
  },
  getAreas: async (thanaId: string) => {
    const response = await apiClient.get(
      `${API_ROUTES.LOGISTICS.AREAS}?thanaId=${thanaId}`,
    );
    return response.data.data || response.data;
  },
  getAggregators: async () => {
    const response = await apiClient.get(API_ROUTES.LOGISTICS.AGGREGATORS);
    return response.data.data || response.data;
  },
};
