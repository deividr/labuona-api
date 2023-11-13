import { test } from "tap";
import { build } from "../helper";
import { db } from "../../src/infra/db/postgres/database";
import { faker } from "@faker-js/faker";
import { User } from "../../src/infra/db/kysely/types/user";
import { NodeCrypto } from "../../src/infra/crypto/node-crypto-adapter";

const mockUser = async (): Promise<{ user: User; rawPassword: string }> => {
  const hasher = new NodeCrypto();
  const rawPassword = faker.internet.password();
  const password = await hasher.hash(rawPassword);

  const newUser = await db
    .insertInto("users")
    .values({
      username: faker.internet.userName(),
      password: password,
      name: faker.person.fullName(),
      isDeleted: false,
    })
    .returningAll()
    .executeTakeFirst();

  return { user: newUser as User, rawPassword };
};

test("Auth", async (t) => {
  t.test("should return 200 if credentials are valid", async (t) => {
    const { user, rawPassword } = await mockUser();
    const app = await build(t);

    const response = await app.inject({
      url: `/auth/login?username=${user.username}&password=${rawPassword}`,
    });

    t.equal(response.statusCode, 200);
    t.hasProp(JSON.parse(response.body), "token");
  });

  t.test("should return 401 if password is invalid", async (t) => {
    const { user } = await mockUser();
    const app = await build(t);

    const response = await app.inject({
      url: `/auth/login?username=${
        user.username
      }&password=${faker.internet.password()}`,
    });

    t.equal(response.statusCode, 401);
  });

  t.test("should return 401 if username is invalid", async (t) => {
    const { rawPassword } = await mockUser();
    const app = await build(t);

    const response = await app.inject({
      url: `/auth/login?username=${faker.internet.userName()}&password=${rawPassword}`,
    });

    t.equal(response.statusCode, 401);
  });

  t.test(
    "should return 400 if does not provider all informations",
    async (t) => {
      const app = await build(t);

      const response = await app.inject({
        url: `/auth/login?username=${faker.internet.userName()}`,
      });

      t.equal(response.statusCode, 400);
    },
  );

  t.teardown(async () => {
    await db.destroy();
  });
});
