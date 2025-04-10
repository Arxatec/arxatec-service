// src/modules/auth/domain/dtos/reset_password.dto.ts
import { z } from "zod";

export const ResetPasswordSchema = z.object({
  token: z.string(),
  code: z.string().length(4, "Code must be 4 digits"),
  new_password: z.string().min(6, "Password must have at least 6 characters"),
  confirm_password: z.string().min(6),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;
