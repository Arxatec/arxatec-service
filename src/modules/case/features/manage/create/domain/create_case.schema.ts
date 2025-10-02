// src/modules/cases/features/manage/create_case/domain/dtos/create_case.schema.ts
import { z } from "zod";

export const CreateCaseSchema = z.object({
  service_id: z
    .string({ required_error: "El ID del servicio debe ser una cadena" })
    .uuid("El ID del servicio debe tener formato UUID")
    .optional(),

  title: z
    .string({ required_error: "El título es obligatorio" })
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(120, "El título no puede superar los 120 caracteres"),

  description: z
    .string({ required_error: "La descripción es obligatoria" })
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(2000, "La descripción no puede superar los 2000 caracteres"),

  category: z
    .string({ required_error: "La categoría es obligatoria" })
    .min(1, "La categoría debe tener al menos 1 caracter"),

  urgency: z
    .enum(["alta", "media", "baja"], {
      errorMap: () => ({
        message: "La urgencia debe ser 'alta', 'media' o 'baja'",
      }),
    })
    .default("media")
    .optional(),

  status: z
    .string({ required_error: "El estado es obligatorio" })
    .min(1, "El estado debe tener al menos 1 caracter")
    .optional(),

  reference_code: z
    .string({ required_error: "El código de referencia debe ser una cadena" })
    .max(50, "El código de referencia no puede superar los 50 caracteres")
    .optional(),

  selected_lawyer_id: z
    .string({ required_error: "El ID del abogado debe ser una cadena" })
    .uuid("El ID del abogado debe tener formato UUID")
    .optional(),

  external_client_id: z
    .string({ required_error: "El ID del cliente externo debe ser una cadena" })
    .uuid("El ID del cliente externo debe tener formato UUID")
    .optional(),
});
