import { z } from "zod";
import { VerifyCodePasswordResetSchema } from "./verify_code_password_reset.schema";

export type VerifyCodePasswordResetRequest = z.infer<
  typeof VerifyCodePasswordResetSchema
>;

export interface VerifyCodePasswordResetResponse {
  message: string;
}
