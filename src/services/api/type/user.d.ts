export type UserType = {
  id: number;
  name: string;
  email: string;
};

type UsersResponse = {
  data: UserType[];
};
