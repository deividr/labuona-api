import {
  Encrypter,
  LoadUserByUsernameAndPasswordRepository,
} from "@data/protocols";
import { Authentication, AuthenticationParams } from "@domain/usecases";
import { Unauthourized } from "../../presentation/errors";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByUsernameAndPasswordRepository: LoadUserByUsernameAndPasswordRepository,
    private readonly encrypter: Encrypter,
  ) {}

  async auth(params: AuthenticationParams) {
    const hashedPassword = await this.encrypter.encrypt(params.password);
    const userFound = await this.loadUserByUsernameAndPasswordRepository.load({
      ...params,
      password: hashedPassword,
    });

    if (!userFound) {
      throw new Unauthourized();
    }

    return { token: "teste" };
  }
}
