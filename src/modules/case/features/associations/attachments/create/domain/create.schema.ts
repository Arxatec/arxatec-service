// src/modules/cases/features/associations/attachments/create/domain/create.schema.ts
import { z } from "zod";

export const CreateAttachmentSchema = z.object({
  caseId: z.string().uuid("El ID del caso debe tener formato UUID"),
  category_id: z.string().uuid("El ID de la categoría debe tener formato UUID"),
  label: z
    .string()
    .min(1, "La etiqueta es obligatoria")
    .max(100, "La etiqueta no puede superar los 100 caracteres"),
  description: z
    .string()
    .max(255, "La descripción no puede superar los 255 caracteres")
    .optional(),
  file_key: z
    .string()
    .min(
      5,
      "La clave del archivo no es válida, debe tener al menos 5 caracteres"
    ),
});
