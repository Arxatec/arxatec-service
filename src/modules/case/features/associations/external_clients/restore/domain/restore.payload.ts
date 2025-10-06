// src/modules/case/features/associations/external_clients/restore/domain/restore.payload.ts
import z from "zod";
import { RestoreExternalClientParamsSchema } from "./restore.schema";

export type RestoreExternalClientRequest = z.infer<
  typeof RestoreExternalClientParamsSchema
>;

export interface RestoreExternalClientResponse {
  id: string;
  message: string;
}
