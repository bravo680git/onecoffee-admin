import { axiosClient } from "./axiosClient";
import { UsersResponse } from "./type/user";

const route = "/user";

export const userApi = {
  getAll() {
    return axiosClient.get<never, BaseResponse<UsersResponse>>(route);
  },
};
