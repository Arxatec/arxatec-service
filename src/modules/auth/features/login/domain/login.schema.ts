import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format")
    .trim(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must have at least 6 characters")
    .trim(),
});
