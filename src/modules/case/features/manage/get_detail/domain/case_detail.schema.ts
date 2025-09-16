// src/modules/cases/features/manage/case_detail/domain/case_detail.schema.ts
import { z } from "zod";

export const CaseDetailParamsSchema = z.object({
  id: z.string().uuid("INVALID_CASE_ID"),
});

export type CaseDetailParamsDTO = z.infer<typeof CaseDetailParamsSchema>;
