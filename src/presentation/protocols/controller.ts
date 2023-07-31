import { HttpResponse } from './http-response';

export type Controller<T, R> = {
  handle: (values: T) => Promise<HttpResponse<R>>;
};
