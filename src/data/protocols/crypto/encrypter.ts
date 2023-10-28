export interface Encrypter<T> {
  encrypt: (payload: T) => Promise<string>;
}
