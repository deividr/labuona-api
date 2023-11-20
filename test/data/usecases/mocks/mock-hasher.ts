import { faker } from "@faker-js/faker";
import { Hasher } from "../../../../src/data/protocols/crypto/hasher";

export class HasherSpy implements Hasher {
  value: string = "";
  hashedValue = faker.string.uuid();
  async hash(value: string) {
    this.value = value;
    return this.hashedValue;
  }
}
