import { FormItemProps } from "antd";

export const RULES: Record<
  "REQUIRED" | "NUMBER",
  NonNullable<FormItemProps["rules"]>[number]
> = {
  REQUIRED: { required: true, message: "Trường này là bắc buộc" },
  NUMBER: { type: "number", message: "Vui lòng nhập một số hợp lệ" },
};

export enum Action {
  view,
  create,
  edit,
  delete,
}

export const PRODUCT_EDITOR_OPTION = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "link"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
  format: [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "link",
    "header",
    "list",
    "script",
    "indent",
    "color",
    "background",
    "align",
    "clean",
  ],
};

export const BLOG_EDITOR_OPTION = {
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ script: "sub" }, { script: "super" }],
      ["link", "image", "blockquote"],
      ["clean"],
    ],
  },
  format: [
    ...PRODUCT_EDITOR_OPTION.format,
    "header",
    "size",
    "image",
    "blockquote",
  ],
};
