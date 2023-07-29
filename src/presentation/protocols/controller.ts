export type Controller<T> = {
  handle: (values: T) => any;
};
