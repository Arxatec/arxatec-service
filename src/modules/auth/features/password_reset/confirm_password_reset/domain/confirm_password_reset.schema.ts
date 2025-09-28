import { z } from "zod";

export const ConfirmPasswordResetSchema = z
  .object({
    email: z
      .string({ required_error: "El correo electrónico es obligatorio" })
      .email(
        "El formato del correo electrónico no es válido, revisa que esté escrito correctamente"
      )
      .trim(),
    password: z
      .string({ required_error: "La contraseña es obligatoria" })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(20, "La contraseña no puede tener más de 20 caracteres")
      .trim(),
    confirm_password: z
      .string({
        required_error: "La confirmación de contraseña es obligatoria",
      })
      .min(8, "La confirmación de contraseña debe tener al menos 8 caracteres")
      .max(
        20,
        "La confirmación de contraseña no puede tener más de 20 caracteres"
      )
      .trim(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirm_password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirm_password"],
        message:
          "Las contraseñas no coinciden, por favor verifica que las contraseñas coincidan.",
      });
    }
  });
