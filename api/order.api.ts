import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const orderApi = {
  createOrder: async (data: any) => {
    const response = await apiClient.post(API_ROUTES.ORDERS.BASE, data);
    return response.data;
  },
  getOrders: async () => {
    const response = await apiClient.get(API_ROUTES.ORDERS.BASE);
    return response.data;
  },
  getOrderById: async (id: string) => {
    const response = await apiClient.get(API_ROUTES.ORDERS.DETAILS(id));
    return response.data;
  },
};
