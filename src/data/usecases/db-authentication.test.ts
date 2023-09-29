import { faker } from "@faker-js/faker";
import { test } from "tap";
import {
  LoadUserByUsernameAndPasswordRepository,
  LoadUserByUsernameAndPasswordRepositoryParams,
  Encrypter,
} from "@data/protocols";
import { User } from "@domain/models";
import { DbAuthentication } from "./db-authentication";
import { Unauthourized } from "../../presentation/errors";

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

class EncrypterSpy implements Encrypter {
  value: string = "";
  hashedValue = faker.string.uuid();
  async encrypt(value: string) {
    this.value = value;
    return this.hashedValue;
  }
}

const mockDbAuthenticationParams = () => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
});

const makeSut = () => {
  const loadUserByUsernameAndPasswordRepositorySpy =
    new LoadUserByUsernameAndPasswordRepositorySpy();

  const encrypterSpy = new EncrypterSpy();

  const sut = new DbAuthentication(
    loadUserByUsernameAndPasswordRepositorySpy,
    encrypterSpy,
  );

  return { sut, loadUserByUsernameAndPasswordRepositorySpy, encrypterSpy };
};

test("Db Authentication", async () => {
  test("should call Encrypt function with corret values", async (t) => {
    const { sut, encrypterSpy } = makeSut();
    const params = mockDbAuthenticationParams();
    await sut.auth(params);
    t.equal(params.password, encrypterSpy.value);
  });

  test("should call LoadUserRepository with correct values", async (t) => {
    const { sut, loadUserByUsernameAndPasswordRepositorySpy, encrypterSpy } =
      makeSut();
    const params = mockDbAuthenticationParams();
    await sut.auth(params);
    t.equal(
      params.username,
      loadUserByUsernameAndPasswordRepositorySpy.params?.username,
    );
    t.equal(
      encrypterSpy.hashedValue,
      loadUserByUsernameAndPasswordRepositorySpy.params?.password,
    );
  });

  test("should throw error if credentials not found", async (t) => {
    const { sut, loadUserByUsernameAndPasswordRepositorySpy } = makeSut();
    loadUserByUsernameAndPasswordRepositorySpy.load = async () => {
      return null as unknown as User;
    };
    const params = mockDbAuthenticationParams();
    t.rejects(sut.auth(params), new Unauthourized());
  });
});
