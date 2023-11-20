import {
  CreateUser,
  CreateUserParams,
  CreateUserReturn,
} from "@domain/usecases";
import { AddUserRepository } from "../../protocols/db/add-user-repository";
import { Hasher } from "@data/protocols";

export class DbCreateUser implements CreateUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepository,
  ) {}

  async create(params: CreateUserParams): Promise<CreateUserReturn> {
    const hashedPassword = await this.hasher.hash(params.password);
    const newUser = await this.addUserRepository.add({
      ...params,
      password: hashedPassword,
    });
    delete newUser.password;
    return newUser;
  }
}
