import { StatusMap } from "elysia";
import { z } from "zod";

type HttpStatus = keyof StatusMap | StatusMap[keyof StatusMap];

export class HttpError extends Error {
  constructor(
    public readonly status: HttpStatus,
    public readonly message: string,
  ) {
    super(message);
  }

  toResponse() {
    const status =
      typeof this.status === "number" ? this.status : StatusMap[this.status];

    return Response.json({ status, message: this.message }, { status });
  }
}

export const HttpErrorSchema = z
  .object({
    status: z.enum(StatusMap).meta({
      description: "Код состояния HTTP",
    }),
    message: z.string().meta({
      description: "Описание ошибки",
    }),
  })
  .meta({ description: "Ошибка" });
