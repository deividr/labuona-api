import { Encrypter } from "@data/protocols";
import { pbkdf2Sync } from "crypto";

export class NodeCrypto implements Encrypter {
  async encrypt(value: string): Promise<string> {
    return pbkdf2Sync(
      value,
      process.env.SALT ?? "",
      1000,
      32,
      "sha512",
    ).toString("hex");
  }
}
