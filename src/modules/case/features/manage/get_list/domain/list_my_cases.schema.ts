// src/modules/cases/features/manage/list_my_cases/domain/list_my_cases.schema.ts
import { z } from "zod";

export const ListMyCasesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type ListMyCasesQueryDTO = z.infer<typeof ListMyCasesQuerySchema>;
