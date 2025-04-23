import { z } from "zod";

export const ConfirmPasswordResetSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address")
    .trim(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be less than 20 characters long")
    .trim(),
  confirm_password: z
    .string({
      required_error: "Confirm password is required",
    })
    .min(8, "Confirm password must be at least 8 characters long")
    .max(20, "Confirm password must be less than 20 characters long")
    .trim(),
});
