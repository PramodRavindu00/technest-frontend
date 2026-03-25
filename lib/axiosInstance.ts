import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    public?: boolean;
    _retry?: boolean;
  }
}

// axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TECHNEST_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!),
  );
  failedQueue = [];
};

//request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.public) return config; // skip auth header for public routes

    //get token from the store
    const token = useAuthStore.getState().accessToken;
    //set token in the autorization headers
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

//response interceptor
api.interceptors.response.use(
  (response) => response,
  //intercepting errors
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // return early if no request config, or is public or already a retried one or its refresh endpoints
    if (
      !originalRequest ||
      originalRequest.public ||
      originalRequest._retry ||
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // if another request is already refreshing — queue current request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.set("Authorization", `Bearer ${token}`);
        return api(originalRequest);
      });
    }

    // mark as request retried and request is refreshing
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      //use the token refresh service
      const refreshResponse = await authService.refresh();
      const newToken = refreshResponse?.accessToken;

      //queue becomes null if refresh becomes successed
      processQueue(null, newToken);
      originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
