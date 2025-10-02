// src/modules/cases/features/manage/list_my_cases/domain/list_my_cases.schema.ts
import { z } from "zod";

export const ListMyCasesQuerySchema = z.object({
  page: z.coerce
    .number()
    .int("La página debe ser un número entero")
    .positive("La página debe ser un número positivo")
    .optional(),

  limit: z.coerce
    .number()
    .int("El límite debe ser un número entero")
    .positive("El límite debe ser un número positivo")
    .max(100, "El límite no puede ser mayor a 100")
    .optional(),

  search: z
    .string()
    .min(1, "El término de búsqueda debe tener al menos 1 carácter")
    .max(100, "El término de búsqueda no puede exceder 100 caracteres")
    .optional(),

  category: z.string().optional(),
  status: z.string().optional(),
});

export type ListMyCasesQueryDTO = z.infer<typeof ListMyCasesQuerySchema>;
