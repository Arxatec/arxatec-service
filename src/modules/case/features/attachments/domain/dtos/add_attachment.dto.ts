// src/modules/cases/features/attachments/domain/dtos/add_attachment.dto.ts
import { z } from "zod";
import { AddAttachmentSchema } from "./add_attachment.schema";

export type AddAttachmentDTO = z.infer<typeof AddAttachmentSchema>;
