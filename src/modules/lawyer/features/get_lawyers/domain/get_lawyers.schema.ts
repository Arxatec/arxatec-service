// src/modules/lawyer/features/get_lawyers/domain/get_lawyers.schema.ts
import { z } from "zod";

export const GetLawyersQuerySchema = z.object({
  search: z
    .string({ invalid_type_error: "El parámetro 'search' debe ser un texto" })
    .trim()
    .min(1, "El parámetro 'search' no puede estar vacío")
    .optional(),

  page: z.coerce
    .number({ invalid_type_error: "El parámetro 'page' debe ser un número" })
    .int("El número de página debe ser un entero")
    .min(1, "El número de página debe ser mayor o igual a 1")
    .default(1),

  limit: z.coerce
    .number({ invalid_type_error: "El parámetro 'limit' debe ser un número" })
    .int("El límite debe ser un número entero")
    .min(1, "El límite mínimo es 1")
    .max(100, "El límite máximo es 100")
    .default(10),
});
