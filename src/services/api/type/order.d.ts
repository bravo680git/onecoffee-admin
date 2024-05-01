import { ORDER_STATUS } from "@/utils/constants";
import { UserType } from "./user";
import { ProductType } from "./product";

type UserAddress = {
  id: number;
  name: string;
  address: string;
  phone: string;
  province: string;
  provinceCode: string;
  district: string;
  districtCode: string;
  ward: string;
  wardCode: string;
  zipCode: string;
  type: string;
};

export type OrderType = {
  id: number;
  addressId: number;
  status: ORDER_STATUS;
  totalPrice: number;
  note: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
  user: UserType;
  address: UserAddress;
  orderDetails: {
    id: number;
    quantity: number;
    productId: number;
    variantId?: number;
    product: ProductType;
    variant?: {
      id: number;
      price: number;
      stockQuantity: number;
      values: string[];
    };
  }[];
};

type UpdateOrderPayload = {
  status: ORDER_STATUS;
  reason?: string;
};
