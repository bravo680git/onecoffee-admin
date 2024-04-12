export type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
};
