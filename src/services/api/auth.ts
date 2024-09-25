import { axiosClient } from "./axiosClient";
import {
  LoginPayload,
  LoginResponse,
  OTPVerifyPayload,
  OTPVerifyResponse,
} from "./type/auth";

export const authApi = {
  login(payload: LoginPayload) {
    return axiosClient.post<unknown, BaseResponse<LoginResponse>>(
      `auth/login`,
      payload
    );
  },
  logout() {
    return axiosClient.post(`auth/logout`);
  },
  verify(payload: OTPVerifyPayload) {
    return axiosClient.post<never, BaseResponse<OTPVerifyResponse>>(
      "/auth/verify-otp",
      payload
    );
  },
  refresh(refreshToken: string) {
    return axiosClient.post<unknown, BaseResponse<LoginResponse>>(
      "/auth/refresh",
      { refreshToken }
    );
  },
};
