import { faker } from "@faker-js/faker";
import { test } from "tap";
import {
  LoadUserByUsernameAndPasswordRepository,
  LoadUserByUsernameAndPasswordRepositoryParams,
  Hasher,
} from "@data/protocols";
import { User } from "@domain/models";
import { DbAuthentication } from "./db-authentication";
import { Unauthourized } from "../../presentation/errors";

class LoadUserByUsernameAndPasswordRepositorySpy
  implements LoadUserByUsernameAndPasswordRepository
{
  params: LoadUserByUsernameAndPasswordRepositoryParams | null = null;

  user: User = {
    name: faker.person.fullName(),
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

class HasherSpy implements Hasher {
  value: string = "";
  hashedValue = faker.string.uuid();
  async hash(value: string) {
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

  const hasherSpy = new HasherSpy();

  const sut = new DbAuthentication(
    loadUserByUsernameAndPasswordRepositorySpy,
    hasherSpy,
  );

  return { sut, loadUserByUsernameAndPasswordRepositorySpy, hasherSpy };
};

test("Db Authentication", async () => {
  test("should call Encrypt function with corret values", async (t) => {
    const { sut, hasherSpy } = makeSut();
    const params = mockDbAuthenticationParams();
    await sut.auth(params);
    t.equal(params.password, hasherSpy.value);
  });

  test("should call LoadUserRepository with correct values", async (t) => {
    const { sut, loadUserByUsernameAndPasswordRepositorySpy, hasherSpy } =
      makeSut();
    const params = mockDbAuthenticationParams();
    await sut.auth(params);
    t.equal(
      params.username,
      loadUserByUsernameAndPasswordRepositorySpy.params?.username,
    );
    t.equal(
      hasherSpy.hashedValue,
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
