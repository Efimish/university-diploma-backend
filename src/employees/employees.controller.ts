import { Elysia } from "elysia";
import { z } from "zod";
import { HttpError, HttpErrorSchema } from "@/error";
import {
  ApiEmployeeInsertSchema,
  ApiEmployeeSelectSchema,
  dbToApi,
  apiToDb,
} from "./employees.model";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export const employeesController = new Elysia({ prefix: "employees" })
  .get(
    "",
    async () => {
      const employees = await db.query.employees.findMany({
        orderBy: { name: "asc" },
      });
      return employees.map(dbToApi);
    },
    {
      detail: {
        summary: "Получить всех работников",
      },
      response: {
        200: ApiEmployeeSelectSchema.array(),
      },
    },
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const employee = await db.query.employees.findFirst({
        where: { id },
      });
      if (!employee) throw new HttpError(404, "Работник не найден");
      return dbToApi(employee);
    },
    {
      detail: {
        summary: "Получить работника по ID",
      },
      params: z.object({ id: z.guid() }),
      response: {
        200: ApiEmployeeSelectSchema,
        404: HttpErrorSchema,
      },
    },
  )
  .post(
    "",
    async ({ body }) => {
      const [employee] = await db
        .insert(schema.employees)
        .values(apiToDb(body))
        .returning();
      if (!employee) throw new HttpError(404, "Работник не найден");
      return dbToApi(employee);
    },
    {
      detail: {
        summary: "Создать работника",
      },
      body: ApiEmployeeInsertSchema,
      response: {
        200: ApiEmployeeSelectSchema,
      },
    },
  )
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const [employee] = await db
        .update(schema.employees)
        .set(apiToDb(body))
        .where(eq(schema.employees.id, id))
        .returning();
      if (!employee) throw new HttpError(404, "Работник не найден");
      return dbToApi(employee);
    },
    {
      detail: {
        summary: "Редактировать работника",
      },
      params: z.object({ id: z.guid() }),
      body: ApiEmployeeInsertSchema,
      response: {
        200: ApiEmployeeSelectSchema,
        404: HttpErrorSchema,
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      const [employee] = await db
        .delete(schema.employees)
        .where(eq(schema.employees.id, id))
        .returning();
      if (!employee) throw new HttpError(404, "Работник не найден");
      return dbToApi(employee);
    },
    {
      detail: {
        summary: "Удалить работника",
      },
      params: z.object({ id: z.guid() }),
      response: {
        200: ApiEmployeeSelectSchema,
        404: HttpErrorSchema,
      },
    },
  );
