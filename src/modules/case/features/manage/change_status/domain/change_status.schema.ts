// src/modules/cases/features/manage/change_status/domain/change_status.schema.ts
import { z } from "zod";

export const ChangeStatusParamsSchema = z.object({
  id: z.string().uuid("El ID del caso debe tener formato UUID"),
});

export const ChangeStatusSchema = z.object({
  status: z.string({ required_error: "El estado es obligatorio" }),
  note: z
    .string()
    .max(255, "La nota no puede superar los 255 caracteres")
    .optional(),
});

export type ChangeStatusRequest = z.infer<typeof ChangeStatusSchema>;
export type ChangeStatusParams = z.infer<typeof ChangeStatusParamsSchema>;
export type ChangeStatusResponse = { message: string; status: string };
