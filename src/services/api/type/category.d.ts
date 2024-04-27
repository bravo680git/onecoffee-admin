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
};

type CategoriesResponse = {
  categories: CategoryType[];
};

type CategoryResponse = {
  category: CategoryType;
};

type UpdateCategoryPayload = CreateCategoryPayload;
