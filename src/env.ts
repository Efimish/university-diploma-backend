import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(0).default(3000),
  DATABASE_URL: z.string().min(1),
});

export const env = EnvSchema.parse(process.env);
