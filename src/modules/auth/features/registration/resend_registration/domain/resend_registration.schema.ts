// src/modules/auth/features/registration/resend_registration/domain/resend_registration.schema.ts
import { z } from "zod";

export const ResendRegistrationSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es obligatorio" })
    .email(
      "El formato del correo electrónico no es válido, revisa que esté escrito correctamente"
    )
    .trim(),
});
