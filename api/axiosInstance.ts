import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { API_ROUTES } from "../config";
import { API_URL } from "../config/env";
import { tokenStorage } from "../store/secureStore";

// Separate instance for refresh logic to avoid circular interceptors
const refreshInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get store lazily to avoid circular dependency issues at evaluation time
const getAuthStore = () => {
  // We use require here because a top-level import creates a circular dependency
  // with authApi -> apiClient -> authStore
  return require("../store/authStore").useAuthStore;
};

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  async (config) => {
    // Get token directly from secure storage to avoid depending on the Zustand store state
    // which might not be initialized yet during the first call.
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle Token Expiration
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!refreshToken) {
        getAuthStore().getState().logout();
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        const { data } = await refreshInstance.post(
          API_ROUTES.AUTH.REFRESH_TOKEN,
          {
            refreshToken,
          },
        );

        const { accessToken, refreshToken: newRefreshToken } = data.data;

        // Update tokens via store (lazy loaded)
        await getAuthStore().getState().setTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        getAuthStore().getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

