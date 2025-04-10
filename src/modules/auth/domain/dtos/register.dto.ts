// src/modules/auth/domain/dtos/register.dto.ts
import { z } from "zod";

export const RegisterSchema = z.object({
  first_name: z.string().min(2, "First name must have at least 2 characters"),
  last_name: z.string().min(2, "Last name must have at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must have at least 6 characters"),
  confirm_password: z.string().min(6),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
