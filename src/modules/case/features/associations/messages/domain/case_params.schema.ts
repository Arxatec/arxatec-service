// src/modules/case/features/messages/domain/case_params.schema.ts
import { z } from "zod";

export const CaseIdParamsSchema = z.object({
  id: z.string().uuid("El ID del caso debe ser UUID"),
});
