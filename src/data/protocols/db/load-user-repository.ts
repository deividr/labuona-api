import { User } from "@domain/models";

export type LoadUserByUsernameAndPasswordRepositoryParams = {
  username: string;
  password: string;
};

export interface LoadUserByUsernameAndPasswordRepository {
  load: (
    params: LoadUserByUsernameAndPasswordRepositoryParams,
  ) => Promise<User | null>;
}
