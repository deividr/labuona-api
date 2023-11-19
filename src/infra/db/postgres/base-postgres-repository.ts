import { Kysely } from "kysely";

export class BaseRepository<T, TNew> {
  constructor(
    private readonly db: Kysely<any>,
    private readonly tableName: string,
  ) {}

  async insert(
    insertableValues: Omit<TNew, "isDeleted" | "createdAt" | "updatedAt">,
  ): Promise<T> {
    return this.db
      .insertInto(this.tableName)
      .values({
        ...insertableValues,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: null,
      })
      .returningAll()
      .executeTakeFirst() as T;
  }
}
