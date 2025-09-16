// src/modules/case/features/associations/external_clients/create/domain/create.dto.ts
import { z } from "zod";
import { CreateExternalClientSchema } from "./create.schema";

export type CreateExternalClientDTO = z.infer<
  typeof CreateExternalClientSchema
>;

export interface CreateExternalClientResponseDTO {
  id: string;
  message: string;
}
