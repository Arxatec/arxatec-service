//src/modules/auth/features/registration/verify_code_registration/domain/verify_code_registration.dto.ts
import { z } from "zod";
import { VerifyCodeRegistrationSchema } from "./verify_code_registration.schema";

export type VerifyCodeRegistrationDTO = z.infer<
  typeof VerifyCodeRegistrationSchema
>;

export interface VerifyCodeRegistrationResponseDTO {
  message: string;
}
