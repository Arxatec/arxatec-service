//src/modules/auth/features/login/login_with_email/domain/login_with_email.schema.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "El correo electrónico es obligatorio",
    })
    .email(
      "El formato del correo electrónico no es válido, revisa que esté escrito correctamente"
    )
    .trim(),
  password: z
    .string({
      required_error: "La contraseña es obligatoria",
    })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .trim(),
});
