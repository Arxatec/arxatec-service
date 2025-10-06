// src/modules/cases/features/manage/history/domain/case_history.schema.ts
import { z } from "zod";

export const CaseHistoryParamsSchema = z.object({
  id: z.string().uuid("El ID del caso debe tener formato UUID"),
});

export type CaseHistoryParams = z.infer<typeof CaseHistoryParamsSchema>;
