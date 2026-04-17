export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    REFRESH_TOKEN: "/api/v1/auth/refresh-token",
    LOGOUT: "/api/v1/auth/logout",
    ME: "/api/v1/auth/me",
    UPDATE_PROFILE: "/api/v1/users/profile",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
  },
  // Add other routes here as needed
  USERS: {
    PROFILE: "/api/v1/users/profile",
  },
  ADDRESS: {
    BASE: "/api/v1/addresses",
    DETAILS: (id: string) => `/api/v1/addresses/${id}`,
    DEFAULT: (id: string) => `/api/v1/addresses/${id}/default`,
  },
  PRODUCTS: {
    LIST: "/api/v1/products",
    DETAILS: (id: string) => `/api/v1/products/${id}`,
    SEARCH: "/api/v1/products/search",
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
  LOGISTICS: {
    DIVISIONS: "/api/v1/logistics/divisions",
    DISTRICTS: "/api/v1/logistics/districts",
    THANAS: "/api/v1/logistics/thanas",
    AREAS: "/api/v1/logistics/areas",
    AGGREGATORS: "/api/v1/logistics/aggregators",
  },
  ORDERS: {
    BASE: "/api/v1/orders",
    DETAILS: (id: string) => `/api/v1/orders/${id}`,
  },
  COUPONS: {
    VALIDATE: "/api/v1/coupons/validate",
  },
} as const;
