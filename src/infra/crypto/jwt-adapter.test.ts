import { test } from "tap";
import { faker } from "@faker-js/faker";
import { JwtAdapter } from "./jwt-adapter";

test("Jwt Encrypter Adapter", async (t) => {
  t.test("should encrpyter string dot not equal entry payload", async (t) => {
    const sut = new JwtAdapter();
    const payload = {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
    };
    const result = await sut.encrypt(payload);
    t.notSame(result, payload);
  });

  t.test("should encrypter value is valid", async () => {
    const sut = new JwtAdapter();
    const payload = {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
    };
    const token = await sut.encrypt(payload);
    const result = await sut.decrypter(token);
    t.has(result.id, payload.id);
    t.has(result.username, payload.username);
  });

  t.test("should throw error if token is invalid", async () => {
    const sut = new JwtAdapter("wrongSalt");
    const sutCorrect = new JwtAdapter();

    const payload = {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
    };

    const token = await sut.encrypt(payload);
    t.rejects(sutCorrect.decrypter(token));
  });
});
