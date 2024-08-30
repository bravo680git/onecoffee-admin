import { RevalidateTags } from "@/utils/constants";
import { axiosClient } from "./axiosClient";
import { revalidateTag } from "./revalidate";
import { BlogType, CreateBlogPayload, UpdateBlogPayload } from "./type/blog";

const route = "/blog";

export const blogApi = {
  getAll() {
    return axiosClient.get<never, BaseResponse<BlogType[]>>(route);
  },
  getById(id: number) {
    return axiosClient.get<never, BaseResponse<BlogType>>(`${route}/${id}`);
  },
  async create(payload: CreateBlogPayload) {
    return axiosClient
      .post<never, BaseResponse<BlogType>>(route, payload)
      .then((res) => {
        revalidateTag(RevalidateTags.blog);
        return res;
      });
  },
  async update(id: number, payload: UpdateBlogPayload) {
    return axiosClient
      .patch<never, BaseResponse<BlogType>>(`${route}/${id}`, payload)
      .then((res) => {
        revalidateTag(RevalidateTags.blogDetail(res.data.slug));
        revalidateTag(RevalidateTags.blog);
        return res;
      });
  },
  async delete(id: number) {
    return axiosClient
      .delete<never, BaseResponse<BlogType>>(`${route}/${id}`)
      .then((res) => {
        revalidateTag(RevalidateTags.blog);
        return res;
      });
  },
};
