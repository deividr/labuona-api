import { HttpResponse } from "./http-response";

export interface Controller<T, R> {
  handle: (body: T) => Promise<HttpResponse<R>>;
}
