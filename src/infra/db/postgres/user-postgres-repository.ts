import {
  LoadUserByUsernameAndPasswordRepository,
  LoadUserByUsernameAndPasswordRepositoryParams,
} from "@data/protocols";
import { db } from "./database";
import { BaseRepository } from "./base-postgres-repository";
import { NewUser, User as UserModel } from "../kysely/types/user";
import { AddUserRepository } from "src/data/protocols/db/add-user-repository";
import { CreateUserParams } from "@domain/usecases";
import {
  LoadUserByUsernameRepository,
  LoadUserByUsernameRepositoryParams,
} from "../../../data/protocols/db/load-user-by-username-repository";

export class User
  extends BaseRepository<UserModel, NewUser>
  implements
    LoadUserByUsernameAndPasswordRepository,
    AddUserRepository,
    LoadUserByUsernameRepository
{
  constructor() {
    super(db, "users");
  }

  async load(params: LoadUserByUsernameAndPasswordRepositoryParams) {
    const result = await db
      .selectFrom("users")
      .selectAll()
      .where("username", "=", params.username)
      .where("password", "=", params.password)
      .executeTakeFirst();

    return result ?? null;
  }

  async loadByUsername(params: LoadUserByUsernameRepositoryParams) {
    const result = await db
      .selectFrom("users")
      .selectAll()
      .where("username", "=", params.username)
      .executeTakeFirst();

    return result ?? null;
  }

  async loadById(id: string) {
    return db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  }

  async add(params: CreateUserParams) {
    return this.insert({ ...params });
  }
}
