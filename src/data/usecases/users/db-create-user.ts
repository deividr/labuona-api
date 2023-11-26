import {
  CreateUser,
  CreateUserParams,
  CreateUserReturn,
} from "@domain/usecases";
import { AddUserRepository } from "../../protocols/db/add-user-repository";
import { Hasher, LoadUserByUsernameRepository } from "@data/protocols";
import { AlreadyExists } from "../../../errors";

export class DbCreateUser implements CreateUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepository,
    private readonly loadUserByUsername: LoadUserByUsernameRepository,
  ) {}

  async create(params: CreateUserParams): Promise<CreateUserReturn> {
    const userFound = await this.loadUserByUsername.loadByUsername({
      username: params.username,
    });

    if (userFound) {
      throw new AlreadyExists("Usuário já existe!");
    }

    const hashedPassword = await this.hasher.hash(params.password);
    const newUser = await this.addUserRepository.add({
      ...params,
      password: hashedPassword,
    });

    delete newUser.password;
    return newUser;
  }
}
