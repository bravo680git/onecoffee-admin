export type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  userId: number;
};

type OTPVerifyPayload = {
  userId: number;
  otpCode: string;
};

type OTPVerifyResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
};
