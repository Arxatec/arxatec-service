// src/modules/cases/features/manage/create_case/domain/create_case.schema.ts
import { z } from "zod";
import { case_category, case_urgency, case_status } from "@prisma/client";

export const CreateCaseSchema = z.object({
  service_id: z
    .string({ invalid_type_error: "El ID del servicio debe ser un texto" })
    .uuid("El ID del servicio debe tener formato UUID válido")
    .optional(),

  title: z
    .string({
      required_error: "El título es obligatorio",
      invalid_type_error: "El título debe ser un texto",
    })
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(120, "El título no puede tener más de 120 caracteres"),

  description: z
    .string({
      required_error: "La descripción es obligatoria",
      invalid_type_error: "La descripción debe ser un texto",
    })
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(2000, "La descripción no puede tener más de 2000 caracteres"),

  category: z.nativeEnum(case_category, {
    required_error: "La categoría es obligatoria",
    invalid_type_error: "La categoría seleccionada no es válida",
  }),

  urgency: z
    .nativeEnum(case_urgency, {
      errorMap: () => ({
        message: "El nivel de urgencia seleccionado no es válido",
      }),
    })
    .default("medium")
    .optional(),

  status: z
    .nativeEnum(case_status, {
      errorMap: () => ({
        message: "El estado del caso seleccionado no es válido",
      }),
    })
    .optional(),

  reference_code: z
    .string({ invalid_type_error: "El código de referencia debe ser un texto" })
    .max(50, "El código de referencia no puede tener más de 50 caracteres")
    .optional(),

  selected_lawyer_id: z
    .string({ invalid_type_error: "El ID del abogado debe ser un texto" })
    .uuid("El ID del abogado debe tener formato UUID válido")
    .optional(),

  external_client_id: z
    .string({
      invalid_type_error: "El ID del cliente externo debe ser un texto",
    })
    .uuid("El ID del cliente externo debe tener formato UUID válido")
    .optional(),
});
