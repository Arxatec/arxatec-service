// src/modules/lawyer/features/get_lawyers/domain/get_lawyers.schema.ts
import { z } from "zod";

export const GetLawyersQuerySchema = z.object({
  search: z.string().optional(),

  page: z.coerce
    .number({ invalid_type_error: "La página debe ser un número" })
    .int("La página debe ser un número entero")
    .positive("La página debe ser un número positivo")
    .optional(),

  limit: z.coerce
    .number({ invalid_type_error: "El límite debe ser un número" })
    .int("El límite debe ser un número entero")
    .positive("El límite debe ser un número positivo")
    .max(100, "El límite máximo permitido es 100")
    .optional(),
});

export type GetLawyersQueryDTO = z.infer<typeof GetLawyersQuerySchema>;
