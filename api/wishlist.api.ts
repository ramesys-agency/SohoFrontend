import apiClient from "./axiosInstance";

export const wishlistApi = {
  toggleWishlist: async (variantId: string) => {
    const response = await apiClient.get(
      `/api/v1/wishlist?variantId=${variantId}`,
    );
    return response.data;
  },
};
