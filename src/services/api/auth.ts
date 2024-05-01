import { axiosClient } from "./axiosClient";
import { LoginPayload, LoginResponse } from "./type/auth";

export const authApi = {
  login(payload: LoginPayload) {
    return axiosClient.post<unknown, BaseResponse<LoginResponse>>(
      `auth/signin`,
      payload
    );
  },
  logout() {
    return axiosClient.get(`auth/logout`);
  },
  confirm(otp: string) {
    return axiosClient.post("/auth/confirm-otp", { otpCode: otp });
  },
  refresh(token: string) {
    return axiosClient.get<unknown, BaseResponse<LoginResponse>>(
      "/auth/refresh",
      {
        headers: { "refresh-token": "Bearer " + token },
      }
    );
  },
};
