// src/modules/cases/features/manage/change_status/domain/change_status.schema.ts
import { z } from "zod";

export const ChangeStatusParamsSchema = z.object({
  id: z.string().uuid("INVALID_CASE_ID"),
});

export const ChangeStatusSchema = z.object({
  status_id: z
    .string({ required_error: "STATUS_ID_REQUIRED" })
    .uuid("INVALID_STATUS_ID"),
  note: z.string().max(255, "NOTE_TOO_LONG").optional(),
});

export type ChangeStatusDTO = z.infer<typeof ChangeStatusSchema>;
