// src/modules/cases/features/associations/attachments/list/domain/list.schema.ts
import { z } from "zod";

export const ListAttachmentsParamsSchema = z.object({
  id: z.string().uuid("INVALID_CASE_ID"),
});

export const ListAttachmentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
