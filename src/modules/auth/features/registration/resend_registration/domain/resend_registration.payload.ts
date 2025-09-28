import { z } from "zod";
import { ResendRegistrationSchema } from "./resend_registration.schema";

export type ResendRegistrationRequest = z.infer<
  typeof ResendRegistrationSchema
>;
export interface ResendRegistrationResponse {
  message: string;
}
