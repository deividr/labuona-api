import {
  LoadUserByUsernameAndPasswordRepository,
  LoadUserByUsernameAndPasswordRepositoryParams,
} from "@data/protocols";
import { db } from "./database";

export class User implements LoadUserByUsernameAndPasswordRepository {
  async load(params: LoadUserByUsernameAndPasswordRepositoryParams) {
    const result = await db
      .selectFrom("users")
      .selectAll()
      .where("username", "=", params.username)
      .executeTakeFirst();

    return result ?? null;
  }
}
