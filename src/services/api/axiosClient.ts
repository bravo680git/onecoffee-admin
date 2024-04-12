import axios from "axios";
import { authStorage } from "../storage";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = "Bearer " + authStorage.getAccessToken();

  config.headers.token = token;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response && response.data,
  (err) => {
    const data = err && err.response && err.response.data;
    return Promise.reject(data);
  }
);
