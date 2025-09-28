import { z } from "zod";
import { ConfirmPasswordResetSchema } from "./confirm_password_reset.schema";

export type ConfirmPasswordResetRequest = z.infer<
  typeof ConfirmPasswordResetSchema
>;

export interface ConfirmPasswordResetResponse {
  message: string;
}
