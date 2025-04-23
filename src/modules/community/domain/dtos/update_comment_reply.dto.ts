import { z } from "zod";

export const UpdateCommentReplySchema = z.object({
  reply: z.string().min(1).optional()
});

export type UpdateCommentReplyDTO = z.infer<typeof UpdateCommentReplySchema>;
