import { z } from "zod";
import { ResendRegistrationSchema } from "./resend_registration.schema";

export type ResendRegistrationDTO = z.infer<typeof ResendRegistrationSchema>;

export interface ResendRegistrationResponseDTO {
  message: string;
}
