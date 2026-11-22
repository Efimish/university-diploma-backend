import { Elysia } from "elysia";
import { z } from "zod";
import { HttpError, HttpErrorSchema } from "@/error";
import {
  ApiUserInsertSchema,
  ApiUserSelectSchema,
  dbToApi,
  apiToDb,
} from "./users.model";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export const usersController = new Elysia({ prefix: "users" })
  .get(
    "",
    async () => {
      const users = await db.query.users.findMany({
        with: { employee: true },
        orderBy: { employee: { name: "asc" } },
      });
      return users.map(dbToApi);
    },
    {
      detail: {
        summary: "Получить всех пользователей",
      },
      response: {
        200: ApiUserSelectSchema.array(),
      },
    },
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const user = await db.query.users.findFirst({
        with: { employee: true },
        where: { id },
      });
      if (!user) throw new HttpError(404, "Пользователь не найден");
      return dbToApi(user);
    },
    {
      detail: {
        summary: "Получить пользователя по ID",
      },
      params: z.object({ id: z.guid() }),
      response: {
        200: ApiUserSelectSchema,
        404: HttpErrorSchema,
      },
    },
  )
  .post(
    "",
    async ({ body }) => {
      return await db.transaction(async (tx) => {
        const [{ userId }] = await tx
          .insert(schema.users)
          .values(await apiToDb(body))
          .returning({ userId: schema.users.id });
        const user = await tx.query.users.findFirst({
          with: { employee: true },
          where: { id: userId },
        });
        if (!user) throw new HttpError(404, "Пользователь не найден");
        return dbToApi(user);
      });
    },
    {
      detail: {
        summary: "Создать пользователя",
      },
      body: ApiUserInsertSchema,
      response: {
        200: ApiUserSelectSchema,
      },
    },
  )
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      return await db.transaction(async (tx) => {
        await tx
          .update(schema.users)
          .set(await apiToDb(body))
          .where(eq(schema.users.id, id));
        const user = await tx.query.users.findFirst({
          with: { employee: true },
          where: { id },
        });
        if (!user) throw new HttpError(404, "Пользователь не найден");
        return dbToApi(user);
      });
    },
    {
      detail: {
        summary: "Редактировать пользователя",
      },
      params: z.object({ id: z.guid() }),
      body: ApiUserInsertSchema,
      response: {
        200: ApiUserSelectSchema,
        404: HttpErrorSchema,
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      return await db.transaction(async (tx) => {
        await tx
          .delete(schema.users)
          .where(eq(schema.users.id, id))
          .returning();
        const user = await tx.query.users.findFirst({
          with: { employee: true },
          where: { id },
        });
        if (!user) throw new HttpError(404, "Пользователь не найден");
        return dbToApi(user);
      });
    },
    {
      detail: {
        summary: "Удалить пользователя",
      },
      params: z.object({ id: z.guid() }),
      response: {
        200: ApiUserSelectSchema,
        404: HttpErrorSchema,
      },
    },
  );
