import apiClient from "./axiosInstance";

export const cartApi = {
  getCart: async () => {
    const response = await apiClient.get("/api/v1/cart");
    return response.data;
  },
  addToCart: async (variantId: string) => {
    const response = await apiClient.get(
      `/api/v1/cart/add?variantId=${variantId}`,
    );
    return response.data;
  },
  removeFromCart: async (variantId: string) => {
    const response = await apiClient.get(
      `/api/v1/cart/delete?variantId=${variantId}`,
    );
    return response.data;
  },
};
