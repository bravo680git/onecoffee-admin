import { axiosClient } from "./axiosClient";
import {
  CategoryResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoriesResponse,
} from "./type/category";

const route = "/category";

export const categoryApi = {
  getAll() {
    return axiosClient.get<never, BaseResponse<CategoriesResponse>>(route);
  },
  create(payload: CreateCategoryPayload) {
    return axiosClient.post<never, BaseResponse<CategoryResponse>>(
      route,
      payload
    );
  },
  update(id: number, payload: UpdateCategoryPayload) {
    return axiosClient.patch<never, BaseResponse<CategoryResponse>>(
      `${route}/${id}`,
      payload
    );
  },
  delete(id: number) {
    return axiosClient.delete(`${route}/${id}`);
  },
};
