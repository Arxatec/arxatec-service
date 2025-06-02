import { z } from "zod";

export const UpdateClientSchema = z
  .object({
    profile_picture: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    occupation: z.string().min(1).optional(),
    age_range: z.string().min(1).optional(),
    gender: z.enum(["male", "female"]).optional(),
    birth_date: z.string().min(1).optional(),
    budget: z.number().optional(),
    urgency_level: z.string().min(1).optional(),
    communication_preference: z.string().min(1).optional(),
    coordinates: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
      })
      .optional(),
  })
  .strict();

export type UpdateClientDTO = z.infer<typeof UpdateClientSchema>;
