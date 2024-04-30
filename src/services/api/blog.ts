import { RevalidateTags } from "@/utils/constants";
import { axiosClient } from "./axiosClient";
import { revalidateTag } from "./revalidate";
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
  async create(payload: CreateBlogPayload) {
    return axiosClient
      .post<never, BaseResponse<{ blog: BlogType }>>(route, payload)
      .then((res) => {
        revalidateTag(RevalidateTags.blog);
        return res;
      });
  },
  async update(id: number, payload: UpdateBlogPayload) {
    return axiosClient
      .patch<never, BaseResponse<{ blog: BlogType }>>(`${route}/${id}`, payload)
      .then((res) => {
        revalidateTag(RevalidateTags.blogDetail(res.data.blog.slug));
        return res;
      });
  },
  async delete(id: number) {
    return axiosClient
      .delete<never, BaseResponse<{ blog: BlogType }>>(`${route}/${id}`)
      .then((res) => {
        revalidateTag(RevalidateTags.blog);
        return res;
      });
  },
};
