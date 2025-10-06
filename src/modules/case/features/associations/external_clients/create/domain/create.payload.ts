// src/modules/case/features/associations/external_clients/create/domain/create.payload.ts
import z from "zod";
import { CreateExternalClientSchema } from "./create.schema";

export type CreateExternalClientRequest = z.infer<typeof CreateExternalClientSchema>;

export interface CreateExternalClientResponse {
  id: string;
  message: string;
}
