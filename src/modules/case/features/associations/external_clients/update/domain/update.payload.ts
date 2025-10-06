// src/modules/case/features/associations/external_clients/update/domain/update.payload.ts
import z from "zod";
import { UpdateExternalClientSchema } from "./update.schema";
import { UpdateExternalClientParamsSchema } from "./update.params.schema";

export type UpdateExternalClientRequest = z.infer<
  typeof UpdateExternalClientSchema
>;
export type UpdateExternalClientParams = z.infer<
  typeof UpdateExternalClientParamsSchema
>;

export interface UpdateExternalClientResponse {
  id: string;
  message: string;
}
