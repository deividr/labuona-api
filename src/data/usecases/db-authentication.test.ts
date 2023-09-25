import {
  LoadUserByUsernameAndPasswordRepository,
  LoadUserByUsernameAndPasswordRepositoryParams,
} from "@repositories/load-user-repository";
import { faker } from "@faker-js/faker";
import { test } from "tap";
import { User } from "@models/user";
import { DbAuthentication } from "./db-authentication";

class LoadUserByUsernameAndPasswordRepositorySpy
  implements LoadUserByUsernameAndPasswordRepository
{
  params: LoadUserByUsernameAndPasswordRepositoryParams | null = null;

  user: User = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    isDeleted: faker.datatype.boolean(),
  };

  async load(params: LoadUserByUsernameAndPasswordRepositoryParams) {
    this.params = params;
    this.user.username = params.username;
    this.user.password = params.password;
    return this.user;
  }
}

const mockDbAuthenticationParams = () => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
});

const makeSut = () => {
  const loadUserByUsernameAndPasswordRepositorySpy =
    new LoadUserByUsernameAndPasswordRepositorySpy();

  const sut = new DbAuthentication(loadUserByUsernameAndPasswordRepositorySpy);

  return { sut, loadUserByUsernameAndPasswordRepositorySpy };
};

test("Db Authentication", async () => {
  test("should call LoadUserRepository with correct values", async (t) => {
    const { sut, loadUserByUsernameAndPasswordRepositorySpy } = makeSut();
    const params = mockDbAuthenticationParams();
    await sut.auth(params);
    Object.keys(params).forEach((key) => {
      t.equal(
        params[key as keyof LoadUserByUsernameAndPasswordRepositoryParams],
        loadUserByUsernameAndPasswordRepositorySpy.params![
          key as keyof LoadUserByUsernameAndPasswordRepositoryParams
        ],
      );
    });
  });
});
