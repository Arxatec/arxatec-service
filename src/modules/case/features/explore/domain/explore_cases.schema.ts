// src/modules/case/features/explore_cases/domain/explore_cases.schema.ts
import { z } from "zod";

export const ExploreCasesQuerySchema = z.object({
  category_id: z.string().uuid("INVALID_CATEGORY_ID").optional(),
  status_id: z.string().uuid("INVALID_STATUS_ID").optional(),
  lawyer_id: z.string().uuid("INVALID_LAWYER_ID").optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type ExploreCasesQueryDTO = z.infer<typeof ExploreCasesQuerySchema>;
