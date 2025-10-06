//src/modules/auth/features/registration/request_registration/domain/request_registration.schema.ts
import { z } from "zod";

export const RequestRegistrationSchema = z
  .object({
    first_name: z
      .string({ required_error: "El nombre es obligatorio" })
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .trim(),
    last_name: z
      .string({ required_error: "El apellido es obligatorio" })
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .trim(),
    email: z
      .string({ required_error: "El correo electrónico es obligatorio" })
      .email({
        message:
          "El formato del correo electrónico no es válido, revisa que esté escrito correctamente",
      })
      .trim(),
    password: z
      .string({ required_error: "La contraseña es obligatoria" })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .trim(),
    confirm_password: z
      .string({
        required_error: "La confirmación de contraseña es obligatoria",
      })
      .min(8, "La confirmación de contraseña debe tener al menos 8 caracteres")
      .trim(),
    user_type: z.enum(["client", "lawyer"], {
      required_error: "El tipo de usuario es obligatorio",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden, vuelve a intentar por favor",
    path: ["confirm_password"],
  });
