// src/modules/case/domain/dtos/update_case.dto.ts
import { z } from "zod";

export const UpdateCaseDto = z.object({
  title: z.string().min(5).max(120).optional(),
  description: z.string().min(20).max(2000).optional(),
  category_id: z.number().int().positive().optional(),
  urgency: z.enum(["alta", "media", "baja"]).optional(),
  status_id: z.number().int().positive().optional(),
  is_public: z.boolean().optional(),
  reference_code: z.string().max(50).optional(),
});

export type UpdateCaseDtoType = z.infer<typeof UpdateCaseDto>;
