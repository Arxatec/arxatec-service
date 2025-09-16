// src/modules/case/features/associations/external_clients/update/domain/update.params.schema.ts
import { z } from "zod";

export const UpdateExternalClientParamsSchema = z.object({
  id: z.string().uuid("INVALID_EXTERNAL_CLIENT_ID"),
});

export type UpdateExternalClientParamsDTO = z.infer<
  typeof UpdateExternalClientParamsSchema
>;
