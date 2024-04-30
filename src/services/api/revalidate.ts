import { axiosClient } from "./axiosClient";

const BASE_URL = import.meta.env.VITE_RE_VALIDATE_URL;

export const revalidateTag = async (tag: string) => {
  return axiosClient
    .post(BASE_URL + "/" + tag)
    .then()
    .catch((err) => {
      console.log(err);
    });
};
