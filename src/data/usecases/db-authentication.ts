import { LoadUserByUsernameAndPasswordRepository } from "@repositories/load-user-repository";
import { Authentication, AuthenticationParams } from "@usecases/authentication";
import { Encrypter } from "@data/protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByUsernameAndPasswordRepository: LoadUserByUsernameAndPasswordRepository,
    private readonly encrypter: Encrypter,
  ) {}

  async auth(params: AuthenticationParams) {
    this.encrypter.encrypt(params.password);
    this.loadUserByUsernameAndPasswordRepository.load({ ...params });
    return { token: "teste" };
  }
}
