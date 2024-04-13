import { axiosClient } from "./axiosClient";
import {
  CreateBrandPayload,
  BrandResponse,
  BrandsResponse,
  UpdateBrandPayload,
} from "./type/brand";

const route = "/brand";

export const brandApi = {
  getAll() {
    return axiosClient.get<never, BaseResponse<BrandsResponse>>(route);
  },
  create(payload: CreateBrandPayload) {
    return axiosClient.post<never, BaseResponse<BrandResponse>>(route, payload);
  },
  update(id: number, payload: UpdateBrandPayload) {
    return axiosClient.patch<never, BaseResponse<BrandResponse>>(
      `${route}/${id}`,
      payload
    );
  },
  delete(id: number) {
    return axiosClient.delete<never, BaseResponse<BrandResponse>>(
      `${route}/${id}`
    );
  },
};
