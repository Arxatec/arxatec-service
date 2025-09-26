// src/modules/case/features/associations/external_clients/archive/domain/archive.schema.ts
import { z } from "zod";

export const ArchiveExternalClientParamSchema = z.object({
  id: z.string().uuid("INVALID_EXTERNAL_CLIENT_ID"),
});

export type ArchiveExternalClientParamDTO = z.infer<
  typeof ArchiveExternalClientParamSchema
>;
