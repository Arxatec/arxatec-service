// src/modules/cases/features/manage/case_detail/domain/case_detail.schema.ts
import { z } from "zod";

export const CaseDetailParamsSchema = z.object({
  id: z.string().uuid("El ID del caso debe tener formato UUID"),
});

export type CaseDetailParamsDTO = z.infer<typeof CaseDetailParamsSchema>;
