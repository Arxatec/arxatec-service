import { z } from "zod";
import { ConfirmPasswordResetSchema } from "./confirm_password_reset.schema";

export type ConfirmPasswordResetDTO = z.infer<
  typeof ConfirmPasswordResetSchema
>;

export interface ConfirmPasswordResetResponseDTO {
  message: string;
}
