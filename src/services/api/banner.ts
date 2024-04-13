import { axiosClient } from "./axiosClient";
import {
  BannerListResponse,
  BannerResponse,
  CreateBannerPayload,
  UpdateBannerPayload,
} from "./type/banner";

const route = "/banner";

export const bannerApi = {
  getAll() {
    return axiosClient.get<never, BaseResponse<BannerListResponse>>(route);
  },
  create(payload: CreateBannerPayload) {
    return axiosClient.post<never, BaseResponse<BannerResponse>>(
      route,
      payload
    );
  },
  update(id: number, payload: UpdateBannerPayload) {
    return axiosClient.patch<never, BaseResponse<BannerResponse>>(
      `${route}/${id}`,
      payload
    );
  },
  delete(id: number) {
    return axiosClient.delete<never, BaseResponse<BannerResponse>>(
      `${route}/${id}`
    );
  },
};
