// src/modules/email/domain/dtos/verify_code.dto.ts
import { z } from "zod";
export const VerifyCodeSchema = z.object({
    email: z.string().email(),
    code: z.string().length(4, "Verification code must be 4 digits"),
  });
  
  export type VerifyCodeDTO = z.infer<typeof VerifyCodeSchema>;