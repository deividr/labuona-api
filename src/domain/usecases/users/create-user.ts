import { User, UserSanitize } from "@domain/models";

export type CreateUserParams = Omit<
  Required<User>,
  "id" | "isDeleted" | "createdAt" | "updatedAt"
>;

export type CreateUserReturn = UserSanitize;

export interface CreateUser {
  create: (params: CreateUserParams) => Promise<CreateUserReturn>;
}
