// src/modules/cases/features/associations/attachments/create/domain/create.schema.ts
import { z } from "zod";

export const CreateAttachmentSchema = z.object({
  caseId: z.string().uuid("INVALID_CASE_ID"),
  category_id: z.string().uuid("INVALID_CATEGORY_ID"),
  label: z.string().min(1, "LABEL_REQUIRED").max(100, "LABEL_TOO_LONG"),
  description: z.string().max(255, "DESCRIPTION_TOO_LONG").optional(),
  file_key: z.string().min(5, "INVALID_FILE_KEY"),
});
