import { z } from "zod";

export const ChangeStatusSchema = z.object({
  status_id: z
    .number({ required_error: "STATUS_ID_REQUIRED" })
    .int()
    .positive(),
  note: z.string().max(255, "NOTE_TOO_LONG").optional(),
});


export type ChangeStatusDTO = z.infer<typeof ChangeStatusSchema>;
