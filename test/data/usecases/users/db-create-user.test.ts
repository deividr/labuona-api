import { test } from "tap";
import { DbCreateUser } from "../../../../src/data/usecases/users/db-create-user";
import { faker } from "@faker-js/faker";
import { CreateUserParams } from "../../../../src/domain/usecases";
import { HasherSpy } from "../mocks/mock-hasher";

const mockUser = (): CreateUserParams => ({
  name: faker.person.fullName(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
});

class AddUserRepositorySpy implements AddUserRepositorySpy {
  async add() {
    return {} as any;
  }
}

const makeSut = () => {
  const hasherSpy = new HasherSpy();
  const addUserRepositorySpy = new AddUserRepositorySpy();
  const sut = new DbCreateUser(hasherSpy, addUserRepositorySpy);

  return { sut, hasherSpy };
};

test("Db Create User", async (t) => {
  t.test("should call hasher function with correct value", async (t) => {
    const { sut, hasherSpy } = makeSut();
    const newUserParams = mockUser();
    await sut.create(newUserParams);
    t.equal(hasherSpy.value, newUserParams.password);
  });
});
