import { z } from "zod";

export const UpdateLawyerSchema = z
  .object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    license_number: z.string().min(1).optional(),
    specialty: z.string().min(1).optional(),
    experience: z
      .string()
      .transform((val) => (val ? Number(val) : undefined))
      .optional(),
    biography: z.string().min(1).optional(),
    linkedin: z.string().min(1).optional(),
    preferred_client: z.string().min(1).optional(),
    payment_methods: z.string().min(1).optional(),
    currency: z.string().min(1).optional(),
    profile_picture: z.string().min(1).optional(),
    communication_preference: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    coordinates: z
      .string()
      .transform((val) => {
        if (!val) return undefined;
        const coords = JSON.parse(val);
        return {
          latitude: Number(coords.latitude),
          longitude: Number(coords.longitude),
        };
      })
      .optional(),
  })
  .strict();

export type UpdateLawyerDTO = z.infer<typeof UpdateLawyerSchema>;
