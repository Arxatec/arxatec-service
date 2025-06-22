// create_external_client.dto.ts
import { z } from "zod";
import { CreateExternalClientSchema } from "./create_external_client.schema";

export type CreateExternalClientDTO = z.infer<
  typeof CreateExternalClientSchema
>;

export interface CreateExternalClientResponseDTO {
  id: number;
  message: string;
}
