import { Decrypter, Encrypter } from "@data/protocols";
import { sign, verify } from "jsonwebtoken";

export class JwtAdapter implements Encrypter<any>, Decrypter {
  async encrypt(payload: any): Promise<string> {
    const token = sign(payload, process.env.SALT || "");
    return token;
  }

  async decrypter(token: string): Promise<any> {
    return verify(token, process.env.SALT || "");
  }
}
