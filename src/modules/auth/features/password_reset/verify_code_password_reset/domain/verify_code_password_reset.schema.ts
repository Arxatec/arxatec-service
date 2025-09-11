// src/modules/auth/features/password_reset/verify_code_password_reset/domain/verify_code_password_reset.schema.ts
import { z } from "zod";

export const VerifyCodePasswordResetSchema = z.object({
  code: z
    .string({ required_error: "El código de verificación es obligatorio" })
    .length(4, "El código de verificación debe tener exactamente 4 caracteres")
    .regex(/^\d{4}$/, "El código de verificación debe contener solo dígitos")
    .trim(),
  email: z
    .string({ required_error: "El correo electrónico es obligatorio" })
    .email(
      "El formato del correo electrónico no es válido, revisa que esté escrito correctamente"
    )
    .trim(),
});
