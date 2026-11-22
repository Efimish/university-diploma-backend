import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    employee: r.one.employees({
      from: r.users.employeeId,
      to: r.employees.id,
    }),
  },
}));
