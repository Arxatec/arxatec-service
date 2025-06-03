// src/modules/case/domain/dtos/create_case_attachment.dto.ts
import { z } from "zod";

export const CreateCaseAttachmentDto = z.object({
    file_key:    z.string().min(5).max(255),
    label:       z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    category_id: z.number().int().positive(),
});
export type CreateCaseAttachmentDtoType = z.infer<typeof CreateCaseAttachmentDto>;
