import { RevalidateTags } from "@/utils/constants";
import { axiosClient } from "./axiosClient";
import { revalidateTag } from "./revalidate";
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
  async create(payload: CreateBannerPayload) {
    return axiosClient
      .post<never, BaseResponse<BannerResponse>>(route, payload)
      .then((res) => {
        revalidateTag(RevalidateTags.banner);
        return res;
      });
  },
  async update(id: number, payload: UpdateBannerPayload) {
    return axiosClient
      .patch<never, BaseResponse<BannerResponse>>(`${route}/${id}`, payload)
      .then((res) => {
        revalidateTag(RevalidateTags.banner);
        return res;
      });
  },
  async delete(id: number) {
    return axiosClient
      .delete<never, BaseResponse<BannerResponse>>(`${route}/${id}`)
      .then((res) => {
        revalidateTag(RevalidateTags.banner);
        return res;
      });
  },
};
