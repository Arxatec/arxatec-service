import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const CreateCommunitySchema = z.object({
  name: z.string({
    required_error: MESSAGES.COMMUNITY.COMMUNITY_ERROR_REQUIRED_NAME
  }).min(1, MESSAGES.COMMUNITY.COMMUNITY_ERROR_INVALID_NAME_MIN_LENGTH),
  description: z.string().min(1).optional(),
  banner: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  category_id: z.number().optional()
}).strict();

export type CreateCommunityDTO = z.infer<typeof CreateCommunitySchema>;
