// src/modules/cases/features/associations/attachments/archive/domain/archive.schema.ts
import { z } from "zod";

export const ArchiveAttachmentParamsSchema = z.object({
  id: z.string().uuid("INVALID_CASE_ID"),
  attId: z.string().uuid("INVALID_ATTACHMENT_ID"),
});
