import { test } from "tap";
import { CreateUserValidation } from "./";
import { faker } from "@faker-js/faker";

const makeSut = () => {
  const sut = new CreateUserValidation();
  return {
    sut,
  };
};

test("Create User Validation", async (t) => {
  t.test(
    "should return false if length username less then three(3)",
    async (t) => {
      const { sut } = makeSut();
      const result = await sut.validate({
        name: faker.person.fullName(),
        username: "tim",
        password: faker.internet.password(),
      });
      t.equal(result.success, false);
    },
  );

  t.test("should return success if params is ok", async (t) => {
    const { sut } = makeSut();
    const result = await sut.validate({
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });
    t.equal(result.success, true);
  });
});
