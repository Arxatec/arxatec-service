// src/modules/cases/features/associations/attachments/list/domain/list.schema.ts
import { z } from "zod";

export const ListAttachmentsParamsSchema = z.object({
  id: z.string().uuid("El ID del caso debe tener formato UUID"),
});

export const ListAttachmentsQuerySchema = z.object({
  page: z.coerce
    .number({
      invalid_type_error: "La página debe ser un número",
    })
    .int("La página debe ser un número entero")
    .positive("La página debe ser un número positivo")
    .optional(),

  limit: z.coerce
    .number({
      invalid_type_error: "El límite debe ser un número",
    })
    .int("El límite debe ser un número entero")
    .positive("El límite debe ser un número positivo")
    .max(100, "El límite máximo permitido es 100")
    .optional(),
});
