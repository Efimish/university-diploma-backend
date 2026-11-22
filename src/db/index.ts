import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { relations } from "./relations";
import { env } from "@/env";

export { schema, relations };

export const db = drizzle(env.DATABASE_URL, { relations });
