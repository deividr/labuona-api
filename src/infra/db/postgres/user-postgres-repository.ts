import {
  LoadUserByUsernameAndPasswordRepository,
  LoadUserByUsernameAndPasswordRepositoryParams,
} from "@data/protocols";
import { db } from "./database";
import { BaseRepository } from "./base-postgres-repository";
import { NewUser } from "../kysely/types/user";

export class User
  extends BaseRepository<NewUser>
  implements LoadUserByUsernameAndPasswordRepository
{
  constructor() {
    super(db, "users");
  }

  async load(params: LoadUserByUsernameAndPasswordRepositoryParams) {
    const result = await db
      .selectFrom("users")
      .selectAll()
      .where("username", "=", params.username)
      .executeTakeFirst();

    return result ?? null;
  }
}
