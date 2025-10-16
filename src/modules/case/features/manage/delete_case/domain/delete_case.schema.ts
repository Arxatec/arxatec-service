// src/modules/cases/features/manage/delete_case/domain/delete_case.schema.ts
import { z } from "zod";

export const DeleteCaseParamsSchema = z.object({
  case_id: z.string().uuid("El ID del caso debe tener formato UUID válido"),
});
