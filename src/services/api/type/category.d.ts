export type CreateCategoryPayload = {
  name: string;
  parentId?: number;
  image?: string;
};

type CategoryType = {
  id: number;
  name: string;
  parentId?: number;
  image?: string;
  createdAt?: string;
};

type UpdateCategoryPayload = CreateCategoryPayload;
