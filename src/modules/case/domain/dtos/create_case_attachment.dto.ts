// src/modules/case/domain/dtos/create_case_attachment.dto.ts
import { z } from "zod";

export const CreateCaseAttachmentDto = z.object({
  file_url: z.string().url(),
  filename: z.string().max(140).optional()
});
export type CreateCaseAttachmentDto = z.infer<typeof CreateCaseAttachmentDto>;
