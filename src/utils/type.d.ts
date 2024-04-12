enum Action {
  create = 1,
  edit = 2,
}

type ModalState<T = unknown> = {
  open?: boolean;
  data?: T;
  action?: Action;
};

type BaseResponse<T extends object | object[] = null> = {
  statusCode: number;
  message: string;
  data: T;
};
