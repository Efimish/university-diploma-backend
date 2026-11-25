import { Elysia } from "elysia";
import { bearer } from "@elysia/bearer";
import { jwt } from "@elysia/jwt";
import { z } from "zod";
import { HttpError, HttpErrorSchema } from "@/error";
import { db } from "@/db";
import { env } from "@/env";
import argon2 from "argon2";

const ClaimsSchema = z.object({
  email: z.email(),
});

export const authController = new Elysia({ prefix: "auth" })
  .use(bearer())
  .use(
    jwt({
      secret: env.JWT_SECRET,
    }),
  )
  .post(
    "login",
    async ({ body, jwt }) => {
      const user = await db.query.users.findFirst({
        where: { email: body.email },
      });
      if (!user) throw new HttpError(400, "Неверные данные");
      const isPasswordCorrect = await argon2.verify(
        user.passwordHash,
        body.password,
      );
      if (!isPasswordCorrect) throw new HttpError(400, "Неверные данные");
      const token = await jwt.sign({ email: user.email });
      return { token };
    },
    {
      detail: {
        summary: "Вход в систему",
      },
      body: z.object({
        email: z.email(),
        password: z.string(),
      }),
      response: {
        200: z.object({
          token: z.jwt(),
        }),
        400: HttpErrorSchema,
      },
    },
  )
  .get(
    "check",
    async ({ bearer, jwt }) => {
      if (!bearer) throw new HttpError("Unauthorized", "Не передан токен");
      const claims = await jwt.verify(bearer);
      if (!claims) throw new HttpError("Unauthorized", "Невалидный токен");
      const { data } = ClaimsSchema.safeParse(claims);
      if (!data) throw new HttpError("Unauthorized", "Невалидные claims");
      return data;
    },
    {
      detail: {
        summary: "Проверка токена",
      },
      response: {
        200: ClaimsSchema,
        400: HttpErrorSchema,
      },
    },
  );
