// src/modules/case/features/associations/external_clients/archive/domain/archive.schema.ts
import { z } from "zod";

export const ArchiveExternalClientParamSchema = z.object({
  id: z.string().uuid("El ID del cliente externo debe tener formato UUID"),
});

export type ArchiveExternalClientParamDTO = z.infer<
  typeof ArchiveExternalClientParamSchema
>;
