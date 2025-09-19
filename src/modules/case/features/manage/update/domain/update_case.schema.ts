// src/modules/cases/features/manage/update_case/domain/update_case.schema.ts
import { z } from "zod";

export const UpdateCaseParamsSchema = z.object({
  id: z.string().uuid("El ID del caso debe tener formato UUID"),
});

export const UpdateCaseSchema = z.object({
  title: z
    .string({ required_error: "El título debe ser una cadena" })
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(120, "El título no puede superar los 120 caracteres")
    .optional(),

  description: z
    .string({ required_error: "La descripción debe ser una cadena" })
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(2000, "La descripción no puede superar los 2000 caracteres")
    .optional(),

  category_id: z
    .string({ required_error: "El ID de la categoría debe ser una cadena" })
    .uuid("El ID de la categoría debe tener formato UUID")
    .optional(),

  urgency: z
    .enum(["alta", "media", "baja"], {
      errorMap: () => ({
        message: "La urgencia debe ser 'baja', 'media' o 'alta'",
      }),
    })
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

export type UpdateCaseParamsDTO = z.infer<typeof UpdateCaseParamsSchema>;
export type UpdateCaseDTO = z.infer<typeof UpdateCaseSchema>;
