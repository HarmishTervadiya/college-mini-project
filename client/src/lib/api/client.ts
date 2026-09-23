import axios, { AxiosError, type AxiosInstance } from "axios";
import { normalizeApiError } from "./errors";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 60000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(normalizeApiError(error));
  }
);
