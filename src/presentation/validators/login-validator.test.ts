import { test } from "tap";
import LoginValidation from "./login-validator";

const makeSut = () => {
  const sut = new LoginValidation();
  return {
    sut,
  };
};

test("should return false if length username less then three(3)", async (t) => {
  const { sut } = makeSut();
  const result = await sut.validate({ username: "1234", password: "teste" });
  t.equal(result.success, false);
});

test("should return success if params is ok", async (t) => {
  const { sut } = makeSut();
  const result = await sut.validate({
    username: "username",
    password: "password",
  });
  t.equal(result.success, true);
});
