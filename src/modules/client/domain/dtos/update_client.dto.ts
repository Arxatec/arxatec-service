import { z } from "zod";

export const UpdateClientSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  budget_range: z.string().min(1).optional(),
  urgency_level: z.string().min(1).optional(),
  requirement_type: z.string().min(1).optional(),
  profile_image: z.string().min(1).optional(),
  birth_date: z.string().min(1).optional(),
  gender: z.string().min(1).optional(),
  communication_channel: z.string().min(1).optional(),
  receive_notifications: z.boolean().optional(),
  notification_channels: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  full_address: z.string().min(1).optional(),
  postal_code: z.string().min(1).optional()
}).strict();

export type UpdateClientDTO = z.infer<typeof UpdateClientSchema>;
