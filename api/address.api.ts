import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const addressApi = {
  getAddresses: async () => {
    const response = await apiClient.get(API_ROUTES.ADDRESS.BASE);
    return response.data;
  },
  createAddress: async (data: any) => {
    const response = await apiClient.post(API_ROUTES.ADDRESS.BASE, data);
    return response.data;
  },
  updateAddress: async ({ id, data }: { id: string; data: any }) => {
    const response = await apiClient.put(API_ROUTES.ADDRESS.DETAILS(id), data);
    return response.data;
  },
  deleteAddress: async (id: string) => {
    const response = await apiClient.delete(API_ROUTES.ADDRESS.DETAILS(id));
    return response.data;
  },
  makeDefault: async (id: string) => {
    const response = await apiClient.patch(API_ROUTES.ADDRESS.DEFAULT(id));
    return response.data;
  },
};
