import { z } from "zod";

export const RegisterSchema = z.strictObject({
  email: z.string().email(), 
  password: z.string().min(6),
  first_name: z.string().min(2),
  last_name: z.string().min(2), 
  user_type: z.enum(["client", "lawyer"]),
  license_number: z.string().min(10).optional(),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
