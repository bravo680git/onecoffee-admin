export type CreateBlogPayload = {
  title: string;
  content: string;
  thumbnail?: string;
  categoryId: number;
  seoKeyword: string;
  seoDescription: string;
};

type BlogType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  thumbnail: string;
  categoryId: number;
  seoKeyword: string;
  slug: string;
  seoDescription: string;
};

type UpdateBlogPayload = CreateBlogPayload;
