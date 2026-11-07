import * as pg from "drizzle-orm/pg-core";

export const items = pg.pgTable("items", {
  id: pg.uuid().defaultRandom().primaryKey(),
});
