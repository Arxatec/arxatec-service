// src/modules/case/domain/dtos/create_case.dto.ts
import { z } from "zod";

export const CreateCaseDto = z.object({
  service_id: z.number().int().positive().optional(),
  title: z.string().max(120),
  description: z.string(),
  category_id: z.number().int().positive(),
  status_id: z.number().int().positive().optional(),
  urgency: z.enum(["alta", "media", "baja"]).optional().default("media"),
  is_public: z.boolean().optional().default(false),
  reference_code: z.string().optional(),

  selected_lawyer_id: z.number().int().positive().optional(),
  external_client_id: z.number().int().positive().optional(),
});

export type CreateCaseDtoType = z.infer<typeof CreateCaseDto>;
