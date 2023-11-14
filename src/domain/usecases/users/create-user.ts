import { User } from "@domain/models";

export type CreateUserParams = Omit<
  User,
  "id" | "isDeleted" | "createdAt" | "updatedAt"
>;

export type CreateUserReturn = {
  newUser: User;
};

export interface CreateUser {
  create: (params: CreateUserParams) => Promise<CreateUserReturn>;
}
