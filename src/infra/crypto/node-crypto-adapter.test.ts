import { test } from "tap";
import { NodeCrypto } from "./node-crypto-adapter";
import { faker } from "@faker-js/faker";

test("Node Crypto Adapter", async (t) => {
  t.test("should encrpyter string equal if password as same", async (t) => {
    const sut = new NodeCrypto();
    const password = faker.internet.password();
    const result = await sut.encrypt(password);
    const result2 = await sut.encrypt(password);
    t.equal(result, result2);
  });
});
