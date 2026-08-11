export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/signup",
    REFRESH_TOKEN: "/api/v1/auth/refresh",
    LOGOUT: "/api/v1/auth/logout",
    ME: "/api/v1/auth/me",
    UPDATE_PROFILE: "/api/v1/users/profile",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    SEND_OTP: "/api/v1/auth/send-otp",
    VERIFY_OTP: "/api/v1/auth/verify-otp",
    GOOGLE: "/api/v1/auth/google",
    APPLE: "/api/v1/auth/apple",
    FACEBOOK: "/api/v1/auth/facebook",
  },
  // Add other routes here as needed
  USERS: {
    PROFILE: "/api/v1/users/profile",
    AVATAR: "/api/v1/users/avatar",
    ACCOUNT: "/api/v1/users/account",
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
  HOME_PROMO: {
    GET: "/api/v1/home-promo",
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
  CHECKOUT: {
    CONFIG: "/api/v1/checkout/config",
    RESERVE: "/api/v1/checkout/reserve",
    STATUS: (checkoutId: string) => `/api/v1/checkout/${checkoutId}`,
    RENEW: (checkoutId: string) => `/api/v1/checkout/${checkoutId}/renew`,
    RELEASE: (checkoutId: string) => `/api/v1/checkout/${checkoutId}`,
  },
  COUPONS: {
    VALIDATE: "/api/v1/coupons/validate",
  },
  NOTIFICATIONS: {
    BASE: "/api/v1/notifications",
    UNREAD_COUNT: "/api/v1/notifications/unread-count",
    READ_ALL: "/api/v1/notifications/read-all",
    MARK_READ: (id: string) => `/api/v1/notifications/${id}/read`,
    PUSH_TOKEN: "/api/v1/notifications/push-token",
  },
} as const;
