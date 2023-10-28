import { Client } from "pg";
import { migrateToLatest } from "../src/infra/db/kysely";
import { db } from "../src/infra/db/postgres/database";

const createTestDatabase = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "5432"),
    database: "postgres",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await client.connect();

  await client.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
  await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);

  await client.end();
};

async function initialDBConfig() {
  await createTestDatabase();
  await migrateToLatest();
  await db.destroy();
}

initialDBConfig();
