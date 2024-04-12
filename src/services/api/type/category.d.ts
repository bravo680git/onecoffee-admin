export type CreateCategoryPayload = {
  name: string;
  parentId?: number;
};

type CategoryType = {
  id: number;
  name: string;
  parentId?: number;
};

type CategoriesResponse = {
  categories: CategoryType[];
};

type CategoryResponse = {
  category: CategoryType;
};

type UpdateCategoryPayload = CreateCategoryPayload;
