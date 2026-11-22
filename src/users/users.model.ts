import { z } from "zod";
import {
  ApiEmployeeSelectSchema,
  dbToApi as employeeDbToApi,
} from "@/employees/employees.model";
import { schema } from "@/db";
import argon2 from "argon2";

export type DbUserInsert = typeof schema.users.$inferInsert;
export type DbUserSelect = typeof schema.users.$inferSelect & {
  employee: typeof schema.employees.$inferSelect;
};

export const ApiUserInsertSchema = z.object({
  employeeId: z.guid().meta({
    description: "ID работника",
  }),
  email: z.string().meta({
    description: "E-mail пользователя",
  }),
  password: z.string().meta({
    description: "Пароль пользователя",
  }),
});

export const ApiUserSelectSchema = ApiUserInsertSchema.omit({
  password: true,
}).extend({
  id: z.guid().meta({
    description: "ID пользователя",
  }),
  employee: ApiEmployeeSelectSchema,
});

export type ApiUserInsert = z.infer<typeof ApiUserInsertSchema>;
export type ApiUserSelect = z.infer<typeof ApiUserSelectSchema>;

export const apiToDb = async (data: ApiUserInsert): Promise<DbUserInsert> => ({
  employeeId: data.employeeId,
  email: data.employeeId,
  passwordHash: await argon2.hash(data.password),
});
export const dbToApi = (data: DbUserSelect): ApiUserSelect => ({
  id: data.id,
  employeeId: data.employeeId,
  email: data.email,
  employee: employeeDbToApi(data.employee),
});
