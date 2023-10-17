import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("name", "varchar(30)", (col) => col.notNull())
    .addColumn("username", "varchar(20)", (col) => col.notNull())
    .addColumn("password", "varchar(200)", (col) => col.notNull())
    .addColumn("isDeleted", "boolean", (col) => col.defaultTo(false))
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
