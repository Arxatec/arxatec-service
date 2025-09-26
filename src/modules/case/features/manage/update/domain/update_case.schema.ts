// src/modules/cases/features/manage/update_case/domain/update_case.schema.ts
import { z } from "zod";

export const UpdateCaseParamsSchema = z.object({
  id: z.string().uuid("INVALID_CASE_ID"),
});

export const UpdateCaseSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).optional(),
  category_id: z.string().uuid("INVALID_CATEGORY_ID").optional(),
  urgency: z.enum(["baja", "media", "alta"]).optional(),
  is_public: z.boolean().optional(),
  reference_code: z.string().max(50).optional(),
});

export type UpdateCaseDTO = z.infer<typeof UpdateCaseSchema>;
