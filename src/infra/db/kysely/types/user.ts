import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface UserTable {
  id: Generated<string>;
  name: string;
  username: string;
  password: string;
  createdAt: ColumnType<Date, string | null, never>;
  updatedAt: ColumnType<Date, never, string | null>;
  isDeleted: boolean;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
