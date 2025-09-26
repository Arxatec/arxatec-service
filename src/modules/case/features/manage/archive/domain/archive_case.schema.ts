// src/modules/cases/features/manage/archive/domain/archive_case.schema.ts
import { z } from "zod";

export const ArchiveCaseSchema = z.object({
  id: z
    .string({ required_error: "El ID del caso es obligatorio" })
    .uuid("El ID del caso debe tener formato UUID"),
});
