// src/modules/case/features/associations/external_clients/restore/domain/restore.schema.ts
import { z } from "zod";

export const RestoreExternalClientParamsSchema = z.object({
  id: z.string().uuid("INVALID_EXTERNAL_CLIENT_ID"),
});
