import { z } from "zod";

export const RegisterSchema = z.strictObject({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});
export type RegisterDTO = z.infer<typeof RegisterSchema>;
