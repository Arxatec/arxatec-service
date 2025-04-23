import { z } from "zod";

export const UpdateCommunitySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  banner: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  category_id: z.number().optional()
}).strict();

export type UpdateCommunityDTO = z.infer<typeof UpdateCommunitySchema>;
