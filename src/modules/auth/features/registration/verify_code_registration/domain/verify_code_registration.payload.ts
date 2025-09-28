import { z } from "zod";
import { VerifyCodeRegistrationSchema } from "./verify_code_registration.schema";

export type VerifyCodeRegistrationRequest = z.infer<
  typeof VerifyCodeRegistrationSchema
>;

export interface VerifyCodeRegistrationResponse {
  message: string;
}
