import { test } from "tap";
import { User } from "./user-postgres-repository";
import { faker } from "@faker-js/faker";

test("should return user if exists", async (t) => {
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
