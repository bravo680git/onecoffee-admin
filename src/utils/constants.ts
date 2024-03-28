import { FormItemProps } from "antd";

export const RULES: Record<
  "REQUIRED" | "NUMBER",
  NonNullable<FormItemProps["rules"]>[number]
> = {
  REQUIRED: { required: true, message: "Trường này là bắc buộc" },
  NUMBER: { type: "number", message: "Vui lòng nhập một số hợp lệ" },
};

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
