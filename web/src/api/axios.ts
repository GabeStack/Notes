import axios from "axios";
import { queryClient } from "./queryClient";
import { authEvents } from "./authEvents";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api/v1",
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // ✅ Renova token se o backend enviou um novo
    const newToken = response.headers["x-new-token"];
    if (newToken) {
      localStorage.setItem("token", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

      if (!publicRoutes.some((route) => currentPath.startsWith(route))) {
        queryClient.clear();
        authEvents.emit();
      }
    }

    console.error("❌ Axios Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message,
    });

    return Promise.reject(error);
  }
);