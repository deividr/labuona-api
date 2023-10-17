import { UserTable } from "./user";

export default interface Database {
  users: UserTable;
}
