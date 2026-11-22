import { z } from "zod";
import { schema } from "@/db";

export type DbCropInsert = typeof schema.crops.$inferInsert;
export type DbCropSelect = typeof schema.crops.$inferSelect;

export const ApiCropInsertSchema = z.object({
  title: z.string().meta({
    description: "Название культуры",
  }),
  internalPricePerKg: z.int().min(0).meta({
    description: "Цена для сборщиков",
  }),
  externalPricePerKg: z.int().min(0).meta({
    description: "Цена для самосборщиков",
  }),
});
export const ApiCropSelectSchema = ApiCropInsertSchema.extend({
  id: z.guid().meta({
    description: "ID культуры",
  }),
});

export type ApiCropInsert = z.infer<typeof ApiCropInsertSchema>;
export type ApiCropSelect = z.infer<typeof ApiCropSelectSchema>;

export const apiToDb = (data: ApiCropInsert): DbCropInsert => data;
export const dbToApi = (data: DbCropSelect): ApiCropSelect => data;
