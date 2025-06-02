import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const UpdateCaseStatusSchema = z.object({
  name: z.string({ required_error: MESSAGES.ADMIN.FIELD_REQUIRED }).min(1).optional(),
  description: z.string().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: MESSAGES.ADMIN.AT_LEAST_ONE_FIELD_REQUIRED
});

export type UpdateCaseStatusDTO = z.infer<typeof UpdateCaseStatusSchema>;