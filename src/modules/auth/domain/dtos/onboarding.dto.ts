import { z } from "zod";

export const OnboardingSchema = z.object({
  user_type: z.enum(["client", "lawyer"]),
  profile_image: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().min(9, "Phone must have at least 9 characters"),
  additional_phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  birth_date: z.string().optional(),
  license_number: z.string().optional(),
});

export type OnboardingDTO = z.infer<typeof OnboardingSchema>;
