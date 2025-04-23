import { z } from "zod";
import { MESSAGES } from "../../../../constants/messages";

export const CreateCommentReplySchema = z.object({
  reply: z.string({
    required_error: MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_REQUIRED_REPLY
  }).min(1, MESSAGES.COMMUNITY.COMMENT_REPLY_ERROR_INVALID_REPLY_MIN_LENGTH)
});

export type CreateCommentReplyDTO = z.infer<typeof CreateCommentReplySchema>;
