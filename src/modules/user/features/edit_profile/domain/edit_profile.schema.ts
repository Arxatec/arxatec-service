// src/modules/user/features/edit_profile/domain/edit_profile.schema.ts
import { z } from "zod";

export const EditProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "El nombre es requerido")
      .max(50)
      .optional(),
    lastName: z
      .string()
      .trim()
      .min(1, "El apellido es requerido")
      .max(50)
      .optional(),
    phone: z.string().trim().min(9).max(20).optional(),
    birthDate: z.coerce.date().optional(),
    gender: z.enum(["male", "female", "unspecified"]).optional(),
    password: z.string().min(8).optional(),
    confirmPassword: z.string().min(8).optional(),
  })
  .refine((d) => (d.password ? d.confirmPassword === d.password : true), {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type EditProfileDTO = z.infer<typeof EditProfileSchema>;
