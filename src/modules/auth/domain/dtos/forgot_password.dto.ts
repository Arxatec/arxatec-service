// src/modules/auth/domain/dtos/forgot_password.dto.ts
import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordSchema>;
