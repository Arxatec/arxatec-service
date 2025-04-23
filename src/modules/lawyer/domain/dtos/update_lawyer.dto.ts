import { z } from "zod";

export const UpdateLawyerSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  license_number: z.string().min(1).optional(),
  specialty: z.string().min(1).optional(),
  experience: z.number().optional(),
  biography: z.string().min(1).optional(),
  linkedin: z.string().min(1).optional(),
  preferred_client: z.string().min(1).optional(),
  payment_methods: z.string().min(1).optional(),
  currency: z.string().min(1).optional()
}).strict();

export type UpdateLawyerDTO = z.infer<typeof UpdateLawyerSchema>;
