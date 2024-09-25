import { axiosClient } from "./axiosClient";
import {
  BrandType,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "./type/brand";

const route = "/brand";

export const brandApi = {
  getAll() {
    return axiosClient.get<never, BaseResponse<BrandType[]>>(route);
  },
  create(payload: CreateBrandPayload) {
    return axiosClient.post<never, BaseResponse<BrandType>>(route, payload);
  },
  update(id: number, payload: UpdateBrandPayload) {
    return axiosClient.patch<never, BaseResponse<BrandType>>(
      `${route}/${id}`,
      payload
    );
  },
  delete(id: number) {
    return axiosClient.delete<never, BaseResponse<BrandType>>(`${route}/${id}`);
  },
};
