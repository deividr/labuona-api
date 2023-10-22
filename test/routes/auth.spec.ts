import { test } from "tap";
import { build } from "../helper";

test("auth is loaded", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/auth",
  });

  t.equal(res.payload, "this is an auth");
});
