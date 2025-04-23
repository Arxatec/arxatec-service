import { z } from "zod";

export const RequestPasswordResetSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format")
    .trim(),
});
