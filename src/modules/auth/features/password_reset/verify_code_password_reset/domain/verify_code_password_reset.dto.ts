import { z } from "zod";
import { VerifyCodePasswordResetSchema } from "./verify_code_password_reset.schema";

export type VerifyCodePasswordResetDTO = z.infer<
  typeof VerifyCodePasswordResetSchema
>;

export interface VerifyCodePasswordResetResponseDTO {
  message: string;
}
