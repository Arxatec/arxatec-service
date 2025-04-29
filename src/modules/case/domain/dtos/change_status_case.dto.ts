// src/modules/case/domain/dtos/change_status_case.dto.ts
import { z } from "zod";

export const ChangeStatusCaseDto = z.object({
  target_status: z.enum(["open", "taken", "in_progress", "closed", "archived"])
});
export type ChangeStatusCaseDto = z.infer<typeof ChangeStatusCaseDto>;