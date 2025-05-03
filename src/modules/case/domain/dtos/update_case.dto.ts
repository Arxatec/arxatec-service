// src/modules/case/domain/dtos/update_case.dto.ts
import { z } from "zod";

export const UpdateCaseDto = z.object({
  title: z.string().min(5).max(120).optional(),
  description: z.string().min(20).max(2_000).optional(),
  category: z.enum(["labor", "family", "personal", "corporate", "other"]).optional(),
  type: z.enum(["consultation", "case", "advisory"]).optional(),
  is_public: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, { message: "At least one field must be provided" });
export type UpdateCaseDto = z.infer<typeof UpdateCaseDto>;