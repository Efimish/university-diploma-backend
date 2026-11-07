import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { openapi } from "@elysia/openapi";
import { z } from "zod";
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
  .get("/health", () => ({ status: "ok" as const }), {
    detail: {
      summary: "Проверка работоспособности",
    },
    response: {
      200: z.object({ status: z.literal("ok") }),
    },
  })
  .listen(env.PORT);

console.log(`Listening on http://127.0.0.1:${env.PORT}`);
