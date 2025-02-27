import { z } from "zod";

export const LoginSchema = z.strictObject({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginDTO = z.infer<typeof LoginSchema>;