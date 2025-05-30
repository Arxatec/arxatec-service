// src/modules/case/domain/dtos/change_case_status.dto.ts
import { z } from "zod";

export const ChangeCaseStatusDto = z.object({
  status_id: z.number().int().positive(),
});

export type ChangeCaseStatusDtoType = z.infer<typeof ChangeCaseStatusDto>;
