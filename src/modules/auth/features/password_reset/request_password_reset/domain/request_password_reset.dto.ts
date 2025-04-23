import { z } from "zod";
import { RequestPasswordResetSchema } from "./request_password_reset.schema";

export type RequestPasswordResetDTO = z.infer<
  typeof RequestPasswordResetSchema
>;

export interface RequestPasswordResetResponseDTO {
  message: string;
}
