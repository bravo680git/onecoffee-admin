export type CreateBannerPayload = {
  name: string;
  image: string;
  caption: string;
  link: string;
  isActive: boolean;
};

type UpdateBannerPayload = CreateBannerPayload;

type BannerType = {
  id: number;
  name: string;
  image: string;
  caption: string;
  link: string;
  isActive: boolean;
};

type BannerResponse = {
  banner: BannerType;
};

type BannerListResponse = {
  banners: BannerType[];
};
