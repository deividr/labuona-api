import { Decrypter, Encrypter } from "@data/protocols";
import { sign, verify } from "jsonwebtoken";

export class JwtAdapter implements Encrypter<any>, Decrypter {
  constructor(private readonly SALT: string = process.env.SALT || "") {}

  async encrypt(payload: any): Promise<string> {
    const token = sign(payload, this.SALT);
    return token;
  }

  async decrypter(token: string): Promise<any> {
    return verify(token, this.SALT);
  }
}
