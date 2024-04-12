import { axiosClient } from "./axiosClient";
import { LoginPayload, LoginResponse } from "./type/auth";

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

export const authApi = {
  login(payload: LoginPayload) {
    return axiosClient.post<unknown, BaseResponse<LoginResponse>>(
      `${BASE_URL}/signin`,
      payload
    );
  },
  logout() {
    return axiosClient.get(`${BASE_URL}/logout`);
  },
};
