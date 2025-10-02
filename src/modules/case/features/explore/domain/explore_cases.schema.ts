// src/modules/case/features/explore_cases/domain/explore_cases.schema.ts
import { z } from "zod";

export const ExploreCasesQuerySchema = z.object({
  category: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),

  lawyer_id: z
    .string()
    .uuid("El ID del abogado debe tener formato UUID")
    .optional(),

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

export type ExploreCasesQueryDTO = z.infer<typeof ExploreCasesQuerySchema>;
