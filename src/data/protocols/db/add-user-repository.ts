import { User } from "@domain/models";
import { CreateUserParams } from "@domain/usecases";

export interface AddUserRepository {
  add: (params: CreateUserParams) => Promise<User>;
}
