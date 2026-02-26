export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    REFRESH_TOKEN: "/api/v1/auth/refresh-token",
    LOGOUT: "/api/v1/auth/logout",
    ME: "/api/v1/users/me", // or similar for checking session
    UPDATE_PROFILE: "/api/v1/users/profile",
  },
  // Add other routes here as needed
  PRODUCTS: {
    LIST: "/api/v1/products",
    DETAILS: (id: string) => `/api/v1/products/${id}`,
  },
  COLLECTION: {
    GET_COLLECTIONS: "/api/v1/collections",
  },
  PRODUCT: {
    GET_PRODUCTS: "/api/v1/products",
  },
  CATEGORY: {
    GET_CATEGORIES: "/api/v1/categories",
    GET_PAGE_TITLE: "/api/v1/categories/page-title",
  },
} as const;
