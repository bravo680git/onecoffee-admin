import { axiosClient } from "./axiosClient";

type UploadResponse = {
  image: {
    name: string;
    url: string;
  };
};

export const upload = (name: string, file: File) => {
  const data = new FormData();
  data.append("name", name);
  data.append("file", file);

  return axiosClient.post<never, BaseResponse<UploadResponse>>(
    "/file/upload",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
