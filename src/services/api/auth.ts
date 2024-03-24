import { axiosClient } from "./axiosClient";
import { LoginPayload } from "./type/auth";

export const authApi = {
  login(payload: LoginPayload) {
    return axiosClient.post("/login", payload);
  },
};
