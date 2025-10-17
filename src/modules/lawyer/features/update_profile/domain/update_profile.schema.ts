import { z } from "zod";

export const UpdateLawyerProfileSchema = z.object({
  phone: z.string().trim().optional().nullable(),
  profile_image: z.string().url().optional().nullable(),

  linkedin: z.string().url("Debe ser una URL válida").optional(),
  license_number: z.string().trim().optional(),
  biography: z.string().trim().optional(),
  experience: z.coerce.number().int().min(0).optional(),

  address: z.string().trim().optional().nullable(),
  location_lat: z.coerce.number().optional().nullable(),
  location_lng: z.coerce.number().optional().nullable(),
});
