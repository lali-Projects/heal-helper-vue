import axios from "axios";
import { store } from "../app/store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  try {
    const token = store.getState()?.auth?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // store not ready — ignore
  }
  return config;
});

export default apiClient;
