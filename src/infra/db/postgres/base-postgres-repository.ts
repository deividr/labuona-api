import { Insertable, Kysely } from "kysely";

export class BaseRepository<TInsert extends Insertable<any>> {
  constructor(
    private readonly db: Kysely<any>,
    private readonly tableName: string,
  ) {}

  async insert(insertableValues: TInsert) {
    return this.db
      .insertInto(this.tableName)
      .values(insertableValues)
      .executeTakeFirst();
  }
}
