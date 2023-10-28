import {
  Encrypter,
  Hasher,
  LoadUserByUsernameAndPasswordRepository,
} from "@data/protocols";
import { Authentication, AuthenticationParams } from "@domain/usecases";
import { Unauthourized } from "../../presentation/errors";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByUsernameAndPasswordRepository: LoadUserByUsernameAndPasswordRepository,
    private readonly hasher: Hasher,
    private readonly encrypter: Encrypter<{ id: string; username: string }>,
  ) {}

  async auth(params: AuthenticationParams) {
    const hashedPassword = await this.hasher.hash(params.password);
    const userFound = await this.loadUserByUsernameAndPasswordRepository.load({
      ...params,
      password: hashedPassword,
    });

    if (!userFound) {
      throw new Unauthourized();
    }

    const result = await this.encrypter.encrypt({
      id: userFound.id,
      username: userFound.username,
    });

    return { token: result };
  }
}
