// src/modules/case/features/associations/external_clients/update/domain/update.params.schema.ts
import { z } from "zod";

export const UpdateExternalClientParamsSchema = z.object({
  id: z.string().uuid("El ID del cliente externo debe tener formato UUID"),
});

export type UpdateExternalClientParamsDTO = z.infer<
  typeof UpdateExternalClientParamsSchema
>;
