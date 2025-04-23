import { z } from "zod";

export const VerifyCodePasswordResetSchema = z.object({
  code: z
    .string({
      required_error: "Verification code is required",
    })
    .max(4, "Verification code must be 4 characters long")
    .min(4, "Verification code must be 4 characters long")
    .trim(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format")
    .trim(),
});
