// src/modules/cases/features/manage/create_case/domain/dtos/create_case.schema.ts
import { z } from "zod";

export const CreateCaseSchema = z.object({
  service_id: z.string().uuid().optional(),
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(2000),
  category_id: z.string().uuid(),
  urgency: z.enum(["alta", "media", "baja"]).optional().default("media"),
  status_id: z.string().uuid().optional(),
  is_public: z.boolean().optional().default(true),
  reference_code: z.string().max(50).optional(),
  selected_lawyer_id: z.string().uuid().optional(),
  external_client_id: z.string().uuid().optional(),
});
