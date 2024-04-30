import { RevalidateTags } from "@/utils/constants";
import { axiosClient } from "./axiosClient";
import { revalidateTag } from "./revalidate";
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
  async create(payload: CreateCategoryPayload) {
    return axiosClient
      .post<never, BaseResponse<CategoryResponse>>(route, payload)
      .then((res) => {
        revalidateTag(RevalidateTags.category);
        return res;
      });
  },
  async update(id: number, payload: UpdateCategoryPayload) {
    return axiosClient
      .patch<never, BaseResponse<CategoryResponse>>(`${route}/${id}`, payload)
      .then((res) => {
        revalidateTag(RevalidateTags.category);
        return res;
      });
  },
  async delete(id: number) {
    return axiosClient.delete(`${route}/${id}`).then((res) => {
      revalidateTag(RevalidateTags.category);
      return res;
    });
  },
};
