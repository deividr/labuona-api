export interface Decrypter {
  encrypt: (payload: string) => Promise<any>;
}
