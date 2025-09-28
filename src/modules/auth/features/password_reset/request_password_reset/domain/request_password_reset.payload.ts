import { z } from "zod";
import { RequestPasswordResetSchema } from "./request_password_reset.schema";

export type RequestPasswordResetRequest = z.infer<
  typeof RequestPasswordResetSchema
>;

export interface RequestPasswordResetResponse {
  message: string;
}
