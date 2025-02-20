import { z } from "zod";

export const RegisterSchema = z.strictObject({
  email: z.string().email(), 
  password_hash: z.string().min(6),
  first_name: z.string().min(2),
  last_name: z.string().min(2), 
  role: z.enum(["CLIENT", "LAWYER"]),
  national_registry: z.string().optional(),
  specialty: z.array(z.string()).optional(), 
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;