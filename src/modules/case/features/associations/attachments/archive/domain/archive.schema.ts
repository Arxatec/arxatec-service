// src/modules/cases/features/associations/attachments/archive/domain/archive.schema.ts
import { z } from "zod";

export const ArchiveAttachmentParamsSchema = z.object({
  id: z.string().uuid("El ID del caso debe tener formato UUID"),
  attId: z.string().uuid("El ID del adjunto debe tener formato UUID"),
});
