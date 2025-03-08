import { z } from "zod";

export const UpdateClientSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  profile_image: z.string().url().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  additional_phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  
  birth_date: z.string().optional()
});

export type UpdateClientDTO = z.infer<typeof UpdateClientSchema>;
