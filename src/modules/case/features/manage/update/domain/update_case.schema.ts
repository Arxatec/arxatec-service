// src/modules/cases/features/manage/update_case/domain/update_case.schema.ts
import { z } from "zod";
import { case_category, case_urgency } from "@prisma/client";

export const UpdateCaseParamsSchema = z.object({
  id: z
    .string({ invalid_type_error: "El ID del caso debe ser un texto" })
    .uuid("El ID del caso debe tener un formato UUID válido"),
});

export const UpdateCaseSchema = z.object({
  title: z
    .string({ invalid_type_error: "El título debe ser un texto" })
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(120, "El título no puede tener más de 120 caracteres")
    .optional(),

  description: z
    .string({ invalid_type_error: "La descripción debe ser un texto" })
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(2000, "La descripción no puede tener más de 2000 caracteres")
    .optional(),

  category: z
    .nativeEnum(case_category, {
      errorMap: () => ({ message: "La categoría seleccionada no es válida" }),
    })
    .optional(),

  urgency: z
    .nativeEnum(case_urgency, {
      errorMap: () => ({
        message: "El nivel de urgencia seleccionado no es válido",
      }),
    })
    .optional(),

  reference_code: z
    .string({ invalid_type_error: "El código de referencia debe ser un texto" })
    .max(50, "El código de referencia no puede tener más de 50 caracteres")
    .optional(),

  selected_lawyer_id: z
    .string({ invalid_type_error: "El ID del abogado debe ser un texto" })
    .uuid("El ID del abogado debe tener un formato UUID válido")
    .optional(),

  external_client_id: z
    .string({
      invalid_type_error: "El ID del cliente externo debe ser un texto",
    })
    .uuid("El ID del cliente externo debe tener un formato UUID válido")
    .optional(),
});

export type UpdateCaseParams = z.infer<typeof UpdateCaseParamsSchema>;
export type UpdateCaseRequest = z.infer<typeof UpdateCaseSchema>;
