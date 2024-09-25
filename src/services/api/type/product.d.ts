export type CreateProductPayload = {
  name: string;
  description: string;
  images: string[];
  unit: string;
  price?: number;
  salePercent?: number;
  stockQuantity?: number;
  categoryId: number;
  brandId: number;
  seoKeyword: string;
  seoDescription: string;
  variantProps?: {
    values: string[];
    type: string;
  }[];
  variants?: {
    values: string[];
    price: number;
    stockQuantity: number;
  }[];
  extraOptions?: { name: string; price: number }[];
  pin: boolean;
};

type ProductType = {
  id: number;
  name: string;
  slug: string;
  description: string;
  unit: string;
  images: string[];
  price?: number;
  maxPrice: number;
  minPrice: number;
  salePercent: number;
  stockQuantity?: number;
  variantProps: {
    values: string[];
    type: string;
  }[];
  variants: {
    values: string[];
    price: number;
    stockQuantity: number;
  }[];
  categoryId: number;
  category: {
    name: string;
  };
  extraOptions?: { name: string; price: number }[];
  pin: boolean;
};

type UpdateProductPayload = CreateProductPayload;
