import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = "";

  config.headers.token = token;
  return config;
});

axiosClient.interceptors.response.use((response) => response && response.data);
