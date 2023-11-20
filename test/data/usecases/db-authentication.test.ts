import { faker } from "@faker-js/faker";
import { test } from "tap";
import {
  LoadUserByUsernameAndPasswordRepository,
  LoadUserByUsernameAndPasswordRepositoryParams,
  Encrypter,
} from "../../../src/data/protocols";
import { User } from "../../../src/domain/models";
import { DbAuthentication } from "../../../src/data/usecases/db-authentication";
import { HasherSpy } from "./mocks/mock-hasher";

class LoadUserByUsernameAndPasswordRepositorySpy
  implements LoadUserByUsernameAndPasswordRepository
{
  params: LoadUserByUsernameAndPasswordRepositoryParams | null = null;

  user: User = {
    id: faker.string.uuid(),
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

type TEncrypter = { id: string; username: string };
class EncrypterSpy implements Encrypter<TEncrypter> {
  payload: TEncrypter | null = null;
  result: string = "";

  async encrypt(payload: TEncrypter): Promise<string> {
    this.payload = payload;
    this.result = JSON.stringify(this.payload);
    return this.result;
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
  const encrypterSpy = new EncrypterSpy();

  const sut = new DbAuthentication(
    loadUserByUsernameAndPasswordRepositorySpy,
    hasherSpy,
    encrypterSpy,
  );

  return {
    sut,
    loadUserByUsernameAndPasswordRepositorySpy,
    hasherSpy,
    encrypterSpy,
  };
};

test("Db Authentication", async () => {
  test("should call Hasher function with corret values", async (t) => {
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

  test("should return null if credentials not found", async (t) => {
    const { sut, loadUserByUsernameAndPasswordRepositorySpy } = makeSut();
    loadUserByUsernameAndPasswordRepositorySpy.load = async () => {
      return null as unknown as User;
    };
    const params = mockDbAuthenticationParams();
    const response = await sut.auth(params);
    t.equal(response, null);
  });

  test("should call Encrypt function with correct value", async (t) => {
    const { sut, encrypterSpy, loadUserByUsernameAndPasswordRepositorySpy } =
      makeSut();
    const params = mockDbAuthenticationParams();
    await sut.auth(params);
    t.equal(
      encrypterSpy.payload?.id,
      loadUserByUsernameAndPasswordRepositorySpy.user.id,
    );
    t.equal(
      encrypterSpy.payload?.username,
      loadUserByUsernameAndPasswordRepositorySpy.user.username,
    );
  });

  test("should throw error if encrypter throw error", async (t) => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.encrypt = async () => {
      throw Error("Encrypter error");
    };
    const params = mockDbAuthenticationParams();
    t.rejects(sut.auth(params));
  });

  test("should return token if all things ok", async (t) => {
    const { sut, encrypterSpy } = makeSut();
    const params = mockDbAuthenticationParams();
    const result = await sut.auth(params);
    t.equal(result?.token, encrypterSpy.result);
  });
});
