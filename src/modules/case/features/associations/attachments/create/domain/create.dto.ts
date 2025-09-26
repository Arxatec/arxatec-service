// src/modules/cases/features/associations/attachments/create/domain/create.dto.ts
import { z } from "zod";
import { CreateAttachmentSchema } from "./create.schema";

export type CreateAttachmentDTO = z.infer<typeof CreateAttachmentSchema>;
