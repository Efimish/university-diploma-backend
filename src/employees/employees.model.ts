import { z } from "zod";
import { schema } from "@/db";

export type DbEmployeeInsert = typeof schema.employees.$inferInsert;
export type DbEmployeeSelect = typeof schema.employees.$inferSelect;

export const ApiEmployeeInsertSchema = z.object({
  role: z.enum(["сборщик", "тракторист", "бригадир", "агроном"]).meta({
    description: "Должность работника",
  }),
  name: z.string().meta({
    description: "Имя работника",
  }),
  type: z.enum(["постоянный", "временный"]).meta({
    description: "Тип работника",
  }),
});

export const ApiEmployeeSelectSchema = ApiEmployeeInsertSchema.extend({
  id: z.guid().meta({
    description: "ID работника",
  }),
  createdAt: z.iso.datetime().meta({
    description: "Дата и время создания работника",
  }),
});

export type ApiEmployeeInsert = z.infer<typeof ApiEmployeeInsertSchema>;
export type ApiEmployeeSelect = z.infer<typeof ApiEmployeeSelectSchema>;

export const apiToDb = (data: ApiEmployeeInsert): DbEmployeeInsert => data;
export const dbToApi = (data: DbEmployeeSelect): ApiEmployeeSelect => ({
  id: data.id,
  role: data.role,
  name: data.name,
  type: data.type,
  createdAt: data.createdAt.toISOString(),
});
