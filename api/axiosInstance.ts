import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { API_ROUTES } from "../config";
import { API_URL } from "../config/env";
import { useAuthStore } from "../store/authStore";
import { tokenStorage } from "../store/secureStore"; // or use values from store directly if preferred

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

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from store or secure storage (store is faster if synced)
    const token = useAuthStore.getState().accessToken;
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
    }; // Access internal config

    // Check if error is 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
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
      const refreshToken = await tokenStorage.getRefreshToken(); // fetch directly from storage for reliability

      // If we do not have a refresh token, we cannot refresh. Log out (clears any stale auth state) and reject with the original error.
      // E.g., This ensures during login if 401 occurs, the actual login error message correctly propagates to the user.
      if (!refreshToken) {
        useAuthStore.getState().logout();
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

        const { accessToken, refreshToken: newRefreshToken } = data.data; // adjust based on API response structure

        // Update tokens in store and storage
        await useAuthStore.getState().setTokens(accessToken, newRefreshToken);

        // Process queue with new token
        processQueue(null, accessToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed - logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
