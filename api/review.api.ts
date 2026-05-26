import apiClient from "./axiosInstance";

export const reviewApi = {
  addReview: async (
    productId: string,
    data: { rating: number; comment?: string },
  ) => {
    // API_ROUTES.PRODUCT.REVIEWS is not defined yet, let's assume standard format
    // Wait, the backend route is `/v1/reviews/`
    const response = await apiClient.post("/api/v1/reviews", {
      productId,
      ...data,
    });
    return response.data;
  },
};
