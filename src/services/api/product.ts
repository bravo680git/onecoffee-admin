import { RevalidateTags } from "@/utils/constants";
import { axiosClient } from "./axiosClient";
import { revalidateTag } from "./revalidate";
import {
  CreateProductPayload,
  ProductType,
  UpdateProductPayload,
} from "./type/product";

const route = "/product";

export const productApi = {
  async create(payload: CreateProductPayload) {
    return axiosClient.post<never, BaseResponse>(route, payload).then((res) => {
      revalidateTag(RevalidateTags.product);
      return res;
    });
  },
  getAll() {
    return axiosClient.get<never, BaseResponse<ProductType[]>>(route);
  },
  getById(id: number) {
    return axiosClient.get<never, BaseResponse<ProductType>>(`${route}/${id}`);
  },
  async delete(id: number) {
    return axiosClient
      .delete<never, BaseResponse<ProductType>>(`${route}/${id}`)
      .then((res) => {
        revalidateTag(RevalidateTags.product);
        return res;
      });
  },
  async update(id: number, payload: UpdateProductPayload) {
    return axiosClient
      .patch<never, BaseResponse<ProductType>>(`${route}/${id}`, payload)
      .then((res) => {
        revalidateTag(RevalidateTags.productDetail(res.data.slug));
        revalidateTag(RevalidateTags.product);
        return res;
      });
  },
};
