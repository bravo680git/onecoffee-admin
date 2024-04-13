export type CreateBrandPayload = {
  name: string;
};

type UpdateBrandPayload = CreateBrandPayload;
type BrandType = {
  id: number;
  name: string;
};
type BrandsResponse = {
  brands: BrandType[];
};
type BrandResponse = {
  brand: BrandType;
};
