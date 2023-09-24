import { test } from "tap";
import LoginValidation from "./login-validator";

const makeSut = () => {
  const sut = new LoginValidation();
  return {
    sut,
  };
};

test("should return ok false if lenght username less then three(3)", async (t) => {
  const { sut } = makeSut();
  const result = await sut.validate({ username: "1234", password: "teste" });
  t.equal(result.success, false);
});
