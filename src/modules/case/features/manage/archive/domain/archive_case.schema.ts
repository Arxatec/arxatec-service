// src/modules/cases/features/manage/archive/domain/archive_case.schema.ts
import { z } from "zod";

export const ArchiveCaseSchema = z.object({
  id: z
    .string({ required_error: "Case ID is required" })
    .uuid("INVALID_CASE_ID"),
});
