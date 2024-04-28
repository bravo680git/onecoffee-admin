import { axiosClient } from "./axiosClient";
import { BlogType, CreateBlogPayload, UpdateBlogPayload } from "./type/blog";

const route = "/blog";

export const blogApi = {
  getAll() {
    return axiosClient.get<never, BaseResponse<{ blogs: BlogType[] }>>(route);
  },
  getById(id: number) {
    return axiosClient.get<never, BaseResponse<{ blog: BlogType }>>(
      `${route}/${id}`
    );
  },
  create(payload: CreateBlogPayload) {
    return axiosClient.post<never, BaseResponse<{ blog: BlogType }>>(
      route,
      payload
    );
  },
  update(id: number, payload: UpdateBlogPayload) {
    return axiosClient.patch<never, BaseResponse<{ blog: BlogType }>>(
      `${route}/${id}`,
      payload
    );
  },
  delete(id: number) {
    return axiosClient.delete<never, BaseResponse<{ blog: BlogType }>>(
      `${route}/${id}`
    );
  },
};
