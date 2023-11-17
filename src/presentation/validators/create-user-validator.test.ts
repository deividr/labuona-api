import { test } from "tap";
import { CreateUserValidation } from "./";

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
        name: "Jose Antonio da Silva",
        username: "1234",
        password: "teste",
      });
      t.equal(result.success, false);
    },
  );

  t.test("should return success if params is ok", async (t) => {
    const { sut } = makeSut();
    const result = await sut.validate({
      name: "Jose Antonio da Silva",
      username: "username",
      password: "password",
    });
    t.equal(result.success, true);
  });
});
