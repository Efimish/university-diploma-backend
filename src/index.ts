import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { cors } from "@elysia/cors";
import { openapi } from "@elysia/openapi";
import { z } from "zod";
import { HttpError } from "@/error";
import { cropsController } from "@/crops/crops.controller";
import { employeesController } from "@/employees/employees.controller";
import { usersController } from "@/users/users.controller";
import { env } from "@/env";

new Elysia({ adapter: node() })
  .use(
    openapi({
      path: "",
      documentation: {
        info: {
          title: "Диплом API",
          version: "0.0.0",
        },
      },
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
    }),
  )
  .use(cors())
  .error({ HttpError })
  .onError(({ error }) => {
    if (error instanceof HttpError) return error.toResponse();
  })
  .get("/health", () => ({ status: "ok" as const }), {
    detail: {
      summary: "Проверка работоспособности",
    },
    response: {
      200: z.object({ status: z.literal("ok") }),
    },
  })
  .use(cropsController)
  .use(employeesController)
  .use(usersController)
  .listen(env.PORT);

console.log(`Listening on http://127.0.0.1:${env.PORT}`);
