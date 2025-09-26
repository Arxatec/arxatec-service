// src/modules/case/features/associations/external_clients/create/domain/create.schema.ts
import { z } from "zod";

export const CreateExternalClientSchema = z.object({
  full_name: z
    .string()
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(120, "El nombre completo no puede superar los 120 caracteres"),

  phone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(15, "El teléfono no puede superar los 15 dígitos"),

  dni: z.string().length(8, "El DNI debe tener exactamente 8 dígitos"),

  email: z
    .string()
    .email("El formato del correo electrónico no es válido")
    .optional(),
});

export type CreateExternalClientDTO = z.infer<
  typeof CreateExternalClientSchema
>;
