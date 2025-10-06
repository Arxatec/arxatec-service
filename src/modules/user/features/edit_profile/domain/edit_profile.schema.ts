// src/modules/user/features/edit_profile/domain/edit_profile.schema.ts
import { z } from "zod";

export const EditProfileSchema = z
  .object({
    firstName: z
      .string({ required_error: "El nombre es obligatorio" })
      .trim()
      .min(1, "El nombre no puede estar vacío")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .optional(),
    lastName: z
      .string({ required_error: "El apellido es obligatorio" })
      .trim()
      .min(1, "El apellido no puede estar vacío")
      .max(50, "El apellido no puede tener más de 50 caracteres")
      .optional(),
    phone: z
      .string({ required_error: "El número de teléfono es obligatorio" })
      .trim()
      .min(9, "El número de teléfono debe tener al menos 9 dígitos")
      .max(20, "El número de teléfono no puede tener más de 20 dígitos")
      .optional(),
    birthDate: z.coerce
      .date({ invalid_type_error: "La fecha de nacimiento no es válida" })
      .optional(),
    gender: z
      .enum(["male", "female", "unspecified"], {
        errorMap: () => ({
          message: "El género debe ser 'male', 'female' o 'unspecified'",
        }),
      })
      .optional(),
    password: z
      .string({ required_error: "La contraseña es obligatoria" })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .optional(),
    confirmPassword: z
      .string({
        required_error: "La confirmación de la contraseña es obligatoria",
      })
      .min(
        8,
        "La confirmación de la contraseña debe tener al menos 8 caracteres"
      )
      .optional(),
  })
  .refine((d) => (d.password ? d.confirmPassword === d.password : true), {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
