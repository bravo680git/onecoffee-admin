enum Action {
  create = 1,
  edit = 2,
}

type ModalState<T = unknown> = {
  open?: boolean;
  data?: T;
  action?: Action;
};
