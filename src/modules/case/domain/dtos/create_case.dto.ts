// src/modules/case/domain/dtos/create_case.dto.ts
import { z } from "zod";

export const CreateCaseDto = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(2_000),
  category: z.enum(["labor", "family", "personal", "corporate", "other"]),
  type: z.enum(["consultation", "case", "advisory"]),
  is_public: z.boolean().optional(),
  selected_lawyer_id: z.number().int().positive().optional(),
  external_client_id: z.number().int().positive().optional() // Solo abogados
});
export type CreateCaseDto = z.infer<typeof CreateCaseDto>;