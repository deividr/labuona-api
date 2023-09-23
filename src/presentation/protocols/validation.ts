export interface Validation<T> {
  validate: (values: T) => Promise<{ ok: boolean; message: string }>;
}
