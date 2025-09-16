// src/modules/cases/features/manage/change_status/domain/change_status.schema.ts
import { z } from "zod";

export const ChangeStatusParamsSchema = z.object({
  id: z.string().uuid("El ID del caso debe tener formato UUID"),
});

export const ChangeStatusSchema = z.object({
  status_id: z
    .string({ required_error: "El ID del estado es obligatorio" })
    .uuid("El ID del estado debe tener formato UUID"),

  note: z
    .string()
    .max(255, "La nota no puede superar los 255 caracteres")
    .optional(),
});

export type ChangeStatusDTO = z.infer<typeof ChangeStatusSchema>;
