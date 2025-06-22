// src/modules/cases/features/create_case/domain/dtos/create_case.schema.ts
import { z } from "zod";

export const CreateCaseSchema = z.object({
  service_id: z.number().int().positive().optional(),

  title: z
    .string({
      required_error: "El título es obligatorio",
    })
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(120, "El título no debe exceder 120 caracteres"),

  description: z
    .string({
      required_error: "La descripción es obligatoria",
    })
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(2000, "La descripción no debe exceder 2000 caracteres"),

  category_id: z
    .number({ required_error: "La categoría es obligatoria" })
    .int()
    .positive(),

  urgency: z
    .enum(["alta", "media", "baja"], {
      invalid_type_error: "Nivel de urgencia inválido",
    })
    .optional()
    .default("media"),

  status_id: z.number().int().positive().optional(),

  is_public: z.boolean().optional().default(true),

  reference_code: z
    .string()
    .max(50, "El código de referencia no puede superar 50 caracteres")
    .optional(),

  selected_lawyer_id: z.number().int().positive().optional(),
  external_client_id: z.number().int().positive().optional(),
});
