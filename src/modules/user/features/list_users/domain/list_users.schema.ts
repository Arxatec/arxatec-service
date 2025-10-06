// src/modules/user/features/list_users/domain/list_users.schema.ts
import { z } from "zod";

export const ListUsersQuerySchema = z.object({
  page: z.coerce
    .number({
      invalid_type_error: "El número de página debe ser un número válido.",
    })
    .int("La página debe ser un número entero.")
    .min(1, "La página mínima permitida es 1.")
    .default(1),

  limit: z.coerce
    .number({
      invalid_type_error: "El límite debe ser un número válido.",
    })
    .int("El límite debe ser un número entero.")
    .min(1, "El límite mínimo permitido es 1.")
    .max(100, "El límite máximo permitido es 100.")
    .default(10),

  q: z
    .string({
      invalid_type_error: "El parámetro de búsqueda debe ser texto.",
    })
    .trim()
    .min(1, "El parámetro de búsqueda no puede estar vacío.")
    .optional(),
});
