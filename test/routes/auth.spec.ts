import { test } from "tap";
import { build } from "../helper";
import { db } from "../../src/infra/db/postgres/database";

test("Auth", async (t) => {
  t.test("auth is loaded", async (t) => {
    const app = await build(t);

    await app.inject({
      url: "/auth/login",
    });
  });

  t.teardown(async () => {
    await db.destroy();
  });
});
