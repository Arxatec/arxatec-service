import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
