// src/modules/cases/features/manage/update_case/domain/update_case.schema.ts
import { z } from "zod";

export const UpdateCaseParamsSchema = z.object({
  id: z.string().uuid("El ID del caso debe tener formato UUID"),
});

export const UpdateCaseSchema = z.object({
  title: z
    .string()
    .min(1, "El título debe tener al menos 1 carácter")
    .max(120, "El título no puede superar los 120 caracteres")
    .optional(),

  description: z
    .string()
    .max(2000, "La descripción no puede superar los 2000 caracteres")
    .optional(),

  category_id: z
    .string()
    .uuid("El ID de la categoría debe tener formato UUID")
    .optional(),

  urgency: z
    .enum(["baja", "media", "alta"], {
      errorMap: () => ({
        message: "La urgencia debe ser 'baja', 'media' o 'alta'",
      }),
    })
    .optional(),

  is_public: z.boolean().optional(),

  reference_code: z
    .string()
    .max(50, "El código de referencia no puede superar los 50 caracteres")
    .optional(),
});

export type UpdateCaseDTO = z.infer<typeof UpdateCaseSchema>;
