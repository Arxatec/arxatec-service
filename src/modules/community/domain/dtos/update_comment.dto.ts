import { z } from "zod";

export const UpdateCommentSchema = z.object({
  comment: z.string().min(1).optional()
});

export type UpdateCommentDTO = z.infer<typeof UpdateCommentSchema>;
