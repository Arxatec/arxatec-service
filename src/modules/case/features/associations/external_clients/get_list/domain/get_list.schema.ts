// src/modules/case/features/associations/external_clients/get_list/domain/get_list.schema.ts
import { z } from "zod";

export const GetExternalClientsQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "La página debe ser un número entero positivo")
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "El límite debe ser un número entero positivo")
    .optional(),
  search: z
    .string()
    .trim()
    .min(1, "El parámetro de búsqueda no puede estar vacío")
    .optional(),
  all: z.string().optional(),
});
