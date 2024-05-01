import { FormItemProps } from "antd";

export const RULES: Record<
  "REQUIRED" | "NUMBER",
  NonNullable<FormItemProps["rules"]>[number]
> = {
  REQUIRED: { required: true, message: "Trường này là bắt buộc" },
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

export const MSG_DIST: Record<string, string> = {
  DUPLICATE_RECORD: "Dữ liệu bị trùng lặp",
};

export enum CATEGORY_TYPE {
  BLOG = 1,
  PRODUCT = 2,
  ABOUT = 3,
}

export const PRODUCT_UNIT = ["cái", "kg", "túi"];
export const FAKE_UPLOAD_URL = import.meta.env.VITE_BASE_URL + "/fake";
export const RevalidateTags = {
  product: "product",
  productDetail(slug: string) {
    return `product-${slug}`;
  },
  category: "category",
  banner: "banner",
  productRate(slug: string) {
    return `rate-${slug}`;
  },
  blog: "blog",
  blogDetail(slug: string) {
    return `blog-${slug}`;
  },
};

export enum ORDER_STATUS {
  NEW = "NEW",
  CONFIRMED = "CONFIRMED",
  DELIVERING = "DELIVERING",
  SUCCESS = "SUCCESS",
  CANCEL = "CANCEL",
  NOT_EXECUTE = "NOT_EXECUTE",
  FAIL = "FAIL",
}

export const ORDER_STATUS_DIST = {
  [ORDER_STATUS.NEW]: {
    title: "Đã tiếp nhận",
    color: "#3498db",
  },
  [ORDER_STATUS.CONFIRMED]: {
    title: "Đã xác nhận",
    color: "#27ae60",
  },
  [ORDER_STATUS.DELIVERING]: {
    title: "Đang vận chuyển",
    color: "#f39c12",
  },
  [ORDER_STATUS.SUCCESS]: {
    title: "Thành công",
    color: "#2ecc71",
  },
  [ORDER_STATUS.CANCEL]: {
    title: "Đã hủy",
    color: "#e74c3c",
  },
  [ORDER_STATUS.NOT_EXECUTE]: {
    title: "Không tiếp nhận",
    color: "#95a5a6",
  },
  [ORDER_STATUS.FAIL]: {
    title: "Thất bại",
    color: "#c0392b",
  },
};

export const ORDER_STATUS_OPTIONS_BY_CURRENT_STATUS = {
  [ORDER_STATUS.NEW]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.NOT_EXECUTE],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.DELIVERING, ORDER_STATUS.NOT_EXECUTE],
  [ORDER_STATUS.DELIVERING]: [ORDER_STATUS.SUCCESS, ORDER_STATUS.FAIL],
  [ORDER_STATUS.CANCEL]: [],
  [ORDER_STATUS.FAIL]: [],
  [ORDER_STATUS.SUCCESS]: [],
  [ORDER_STATUS.NOT_EXECUTE]: [],
};
