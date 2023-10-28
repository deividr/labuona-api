import { test } from "tap";
import { User } from "./user-postgres-repository";
import { faker } from "@faker-js/faker";
import { db } from "./database";

test("User Postgres Repository Test", async (t) => {
  t.test("should return user if exists", async (t) => {
    const newUser = {
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      isDeleted: false,
    };

    const user = new User();

    await user.insert(newUser);

    const foundUser = await user.load({
      username: newUser.username,
      password: newUser.password,
    });

    t.equal(foundUser?.name, newUser.name);
    t.equal(foundUser?.password, newUser.password);
  });

  t.test("should return null if does not exists", async (t) => {
    const user = new User();
    const foundUser = await user.load({
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });

    t.equal(foundUser, null);
  });

  t.teardown(async () => {
    await db.destroy();
  });
});
