// update_external_client.dto.ts
import { z } from "zod";
import { UpdateExternalClientSchema } from "./update_external_client.schema";

export type UpdateExternalClientDTO = z.infer<
  typeof UpdateExternalClientSchema
>;

export interface UpdateExternalClientResponseDTO {
  id: number;
  message: string;
}
