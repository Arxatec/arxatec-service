import { z } from "zod";
import { MESSAGES } from "../../../../constants";

export const SendMessageSchema = z.object({
  message: z.string({
    required_error: MESSAGES.BOT.SEND_MESSAGE_ERROR_REQUIRED_MESSAGE
  }).min(1, MESSAGES.BOT.SEND_MESSAGE_ERROR_INVALID_MESSAGE_MIN_LENGTH),
}).strict();

export type SendMessageDTO = z.infer<typeof SendMessageSchema>;
