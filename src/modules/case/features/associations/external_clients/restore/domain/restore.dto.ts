// src/modules/case/features/associations/external_clients/restore/domain/restore.dto.ts
import { z } from "zod";
import { RestoreExternalClientParamsSchema } from "./restore.schema";

export type RestoreExternalClientParamsDTO = z.infer<
  typeof RestoreExternalClientParamsSchema
>;

export interface RestoreExternalClientResponseDTO {
  id: string;
  message: string;
}
