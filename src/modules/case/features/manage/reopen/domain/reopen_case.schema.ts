// src/modules/cases/features/manage/reopen_case/domain/reopen_case.schema.ts
import { z } from "zod";

export const ReopenCaseParamsSchema = z.object({
  id: z
    .string({ required_error: "Case ID is required" })
    .uuid("INVALID_CASE_ID"),
});
export type ReopenCaseDTO = z.infer<typeof ReopenCaseParamsSchema>;
