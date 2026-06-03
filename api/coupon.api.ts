import { API_ROUTES } from "../config/routes";
import apiClient from "./axiosInstance";

export const couponApi = {
  validateCoupon: async (code: string, cartItems: any[]) => {
    const response = await apiClient.post(API_ROUTES.COUPONS.VALIDATE, {
      code,
      cartItems,
    });
    return response.data.data || response.data;
  },
};
