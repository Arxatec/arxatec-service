import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const CreateCommentSchema = z.object({
  comment: z.string({
    required_error: MESSAGES.COMMUNITY.COMMENT_ERROR_REQUIRED_COMMENT
  }).min(1, MESSAGES.COMMUNITY.COMMENT_ERROR_INVALID_COMMENT_MIN_LENGTH)
});

export type CreateCommentDTO = z.infer<typeof CreateCommentSchema>;
