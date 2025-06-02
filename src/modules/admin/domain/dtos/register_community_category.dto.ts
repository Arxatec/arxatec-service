import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const RegisterCommunityCategorySchema = z.object({
  name: z.string({ required_error: MESSAGES.ADMIN.FIELD_REQUIRED }).min(1),
  description: z.string().optional()
});

export type RegisterCommunityCategoryDTO = z.infer<typeof RegisterCommunityCategorySchema>;