import { axiosClient } from "./axiosClient";
import { OrderType, UpdateOrderPayload } from "./type/order";

const route = "/order";

export const orderApi = {
  getAll() {
    return axiosClient.get<never, BaseResponse<{ orders: OrderType[] }>>(route);
  },
  update(id: number, payload: UpdateOrderPayload) {
    return axiosClient.patch<never, BaseResponse>(`${route}/${id}`, payload);
  },
};
