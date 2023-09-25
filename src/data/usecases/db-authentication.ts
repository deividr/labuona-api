import { LoadUserByUsernameAndPasswordRepository } from "@repositories/load-user-repository";
import { Authentication, AuthenticationParams } from "@usecases/authentication";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByUsernameAndPasswordRepository: LoadUserByUsernameAndPasswordRepository,
  ) {}

  async auth(params: AuthenticationParams) {
    this.loadUserByUsernameAndPasswordRepository.load({ ...params });
    return { token: "teste" };
  }
}
