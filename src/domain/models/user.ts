export type User = {
  id: string;
  name: string;
  username: string;
  password?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};

export type UserSanitize = Omit<User, "password">;
