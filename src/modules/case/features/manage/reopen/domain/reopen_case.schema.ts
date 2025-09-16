// src/modules/cases/features/manage/reopen_case/domain/reopen_case.schema.ts
import { z } from "zod";

export const ReopenCaseParamsSchema = z.object({
  id: z
    .string({ required_error: "El ID del caso es obligatorio" })
    .uuid("El ID del caso debe tener formato UUID"),
});

export type ReopenCaseDTO = z.infer<typeof ReopenCaseParamsSchema>;
