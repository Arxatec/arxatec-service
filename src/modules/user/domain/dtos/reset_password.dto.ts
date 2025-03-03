import { z } from "zod";

export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "La confirmación debe tener al menos 6 caracteres"),
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;
