// src/modules/case/features/explore_cases/domain/explore_cases.schema.ts
import { z } from "zod";
import { case_category, case_status } from "@prisma/client";

export const ExploreCasesQuerySchema = z.object({
  category: z.nativeEnum(case_category).optional(),
  status: z.nativeEnum(case_status).optional(),
  search: z.string().trim().min(1).optional(),
  lawyer_id: z
    .string()
    .uuid("El ID del abogado debe tener formato UUID")
    .optional(),
  page: z.coerce
    .number()
    .int("La página debe ser un número entero")
    .min(1)
    .default(1),
  limit: z.coerce
    .number()
    .int("El límite debe ser un número entero")
    .min(1)
    .max(100, "El límite máximo permitido es 100")
    .default(10),
});

export type ExploreCasesQuery = z.infer<typeof ExploreCasesQuerySchema>;
