import { z } from "zod";

export const LoginSchema = z.strictObject({
  email: z.string().email(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
export type LoginDTO = z.infer<typeof LoginSchema>;
