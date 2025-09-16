// src/modules/case/features/associations/external_clients/restore/domain/restore.schema.ts
import { z } from "zod";

export const RestoreExternalClientParamsSchema = z.object({
  id: z.string().uuid("El ID del cliente externo debe tener formato UUID"),
});
