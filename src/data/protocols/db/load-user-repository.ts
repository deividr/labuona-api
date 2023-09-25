import type { User } from "@models/user";

export type LoadUserByUsernameAndPasswordRepositoryParams = {
  username: string;
  password: string;
};

export interface LoadUserByUsernameAndPasswordRepository {
  load: (
    params: LoadUserByUsernameAndPasswordRepositoryParams,
  ) => Promise<User>;
}
