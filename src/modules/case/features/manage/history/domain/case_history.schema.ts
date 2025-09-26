// src/modules/cases/features/manage/history/domain/case_history.schema.ts
import { z } from "zod";

export const CaseHistoryParamsSchema = z.object({
  id: z.string().uuid("INVALID_CASE_ID"),
});
export type CaseHistoryParamsDTO = z.infer<typeof CaseHistoryParamsSchema>;
