import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const RegisterCaseCategorySchema = z.object({
  name: z.string({ required_error: MESSAGES.ADMIN.FIELD_REQUIRED }).min(1),
  description: z.string().optional()
});

export type RegisterCaseCategoryDTO = z.infer<typeof RegisterCaseCategorySchema>;