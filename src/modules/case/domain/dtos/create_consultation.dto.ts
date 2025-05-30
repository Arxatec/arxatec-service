// src/modules/consultation/domain/dtos/create_consultation.dto.ts
import { z } from "zod";

export const CreateConsultationDto = z.object({
  service_id:    z.number().int().positive().optional(),
  topic:         z.string().max(100),
  question:      z.string().max(2000),
  priority:      z.enum(["alta", "media", "baja"]).optional().default("media"),
  confidential:  z.boolean().optional().default(false),
  requires_call: z.boolean().optional().default(false),
});

export type CreateConsultationDtoType = z.infer<typeof CreateConsultationDto>;
