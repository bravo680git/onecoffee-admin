import { axiosClient } from "./axiosClient";
import {
  CreateProductPayload,
  ProductResponse,
  ProductsResponse,
  UpdateProductPayload,
} from "./type/product";

const route = "/product";

export const productApi = {
  create(payload: CreateProductPayload) {
    return axiosClient.post<never, BaseResponse>(route, payload);
  },
  getAll() {
    return axiosClient.get<never, BaseResponse<ProductsResponse>>(route);
  },
  getById(id: number) {
    return axiosClient.get<never, BaseResponse<ProductResponse>>(
      `${route}/${id}`
    );
  },
  delete(id: number) {
    return axiosClient.delete<never, BaseResponse<ProductResponse>>(
      `${route}/${id}`
    );
  },
  update(id: number, payload: UpdateProductPayload) {
    return axiosClient.patch<never, BaseResponse<ProductResponse>>(
      `${route}/${id}`,
      payload
    );
  },
};
