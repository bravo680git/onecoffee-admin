import axios, { AxiosRequestConfig } from "axios";
import { authStorage } from "../storage";
import { authApi } from "./auth";
import { path } from "@/routes/path";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = "Bearer " + authStorage.getAccessToken();

  config.headers.Authorization = token;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response && response.data,
  async (err) => {
    const data = err && err.response && err.response.data;
    const config = err.config as AxiosRequestConfig & { _retry?: boolean };

    if (data.status === 401 && authStorage.getIsLoggedIn() && !config._retry) {
      config._retry = true;
      try {
        const refreshToken = authStorage.getRefreshToken();
        if (!refreshToken) {
          localStorage.clear();
          location.href = path.login;
          return Promise.reject(data);
        }
        const res = await authApi.refresh(refreshToken);
        authStorage.setAccessToken(res.data.accessToken);
        authStorage.setRefreshToken(res.data.refreshToken);

        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${res.data.accessToken}`,
        };
        return axiosClient(config);
      } catch (err) {
        localStorage.clear();
        location.href = path.login;
        console.log(err);
      }
    }

    return Promise.reject(data);
  }
);
