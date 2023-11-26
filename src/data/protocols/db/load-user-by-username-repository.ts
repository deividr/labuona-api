import { User } from "@domain/models";

export type LoadUserByUsernameRepositoryParams = {
  username: string;
};

export interface LoadUserByUsernameRepository {
  loadByUsername: (
    params: LoadUserByUsernameRepositoryParams,
  ) => Promise<User | null>;
}
