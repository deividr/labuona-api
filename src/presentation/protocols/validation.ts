export interface Validation<T> {
  validate: (values: T) => Promise<{ success: boolean; message: string }>;
}
