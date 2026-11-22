import { Elysia } from "elysia";
import { z } from "zod";
import { HttpError, HttpErrorSchema } from "@/error";
import {
  ApiCropInsertSchema,
  ApiCropSelectSchema,
  dbToApi,
  apiToDb,
} from "./crops.model";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export const cropsController = new Elysia({ prefix: "crops" })
  .get(
    "",
    async () => {
      const crops = await db.query.crops.findMany({
        orderBy: { title: "asc" },
      });
      return crops.map(dbToApi);
    },
    {
      detail: {
        summary: "Получить все культуры",
      },
      response: {
        200: ApiCropSelectSchema.array(),
      },
    },
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const crop = await db.query.crops.findFirst({
        where: { id },
      });
      if (!crop) throw new HttpError(404, "Культура не найдена");
      return dbToApi(crop);
    },
    {
      detail: {
        summary: "Получить культуру по ID",
      },
      params: z.object({ id: z.guid() }),
      response: {
        200: ApiCropSelectSchema,
        404: HttpErrorSchema,
      },
    },
  )
  .post(
    "",
    async ({ body }) => {
      const [crop] = await db.insert(schema.crops).values(body).returning();
      if (!crop) throw new HttpError(404, "Культура не найдена");
      return dbToApi(crop);
    },
    {
      detail: {
        summary: "Создать культуру"
      },
      body: ApiCropInsertSchema,
      response: {
        200: ApiCropSelectSchema,
      },
    },
  )
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const [crop] = await db
        .update(schema.crops)
        .set(apiToDb(body))
        .where(eq(schema.crops.id, id))
        .returning();
      if (!crop) throw new HttpError(404, "Культура не найдена");
      return dbToApi(crop);
    },
    {
      detail: {
        summary: "Редактировать культуру"
      },
      params: z.object({ id: z.guid() }),
      body: ApiCropInsertSchema,
      response: {
        200: ApiCropSelectSchema,
        404: HttpErrorSchema,
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      const [crop] = await db
        .delete(schema.crops)
        .where(eq(schema.crops.id, id))
        .returning();
      if (!crop) throw new HttpError(404, "Культура не найдена");
      return dbToApi(crop);
    },
    {
      detail: {
        summary: "Удалить культуру"
      },
      params: z.object({ id: z.guid() }),
      response: {
        200: ApiCropSelectSchema,
        404: HttpErrorSchema,
      },
    },
  );
