// src/modules/plans/domain/dtos/update_plan.dto.ts
import { z } from "zod";

export const UpdatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  features: z
    .object({
      caseManagement: z.boolean().optional(),
      paymentsAndFinances: z.boolean().optional(),
      communityAccess: z.boolean().optional(),
      messagesAccess: z.boolean().optional(),
      aiIntegration: z.boolean().optional(),
      maxConsultationsPerMonth: z.number().optional(),
      maxContractReviewsPerMonth: z.number().optional(),
      maxVirtualMeetingsPerMonth: z.number().optional(),
      maxRemindersPerMonth: z.number().optional(),
      prioritySupport: z.boolean().optional(),
      exclusiveEvents: z.boolean().optional(),
    })
    .optional(),
});

export type UpdatePlanDTO = z.infer<typeof UpdatePlanSchema>;
