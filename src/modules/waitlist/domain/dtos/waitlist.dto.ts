import { z } from "zod";
import { MESSAGES } from "../../../../constants";

export const SubscribeSchema = z.object({
  name: z.string({
    required_error: MESSAGES.WAITLIST.SUBSCRIBE_ERROR_REQUIRED_NAME,
  }).min(2, MESSAGES.WAITLIST.SUBSCRIBE_ERROR_INVALID_NAME_MIN_LENGTH),
  email: z.string({
    required_error: MESSAGES.WAITLIST.SUBSCRIBE_ERROR_REQUIRED_EMAIL,
  }).email(MESSAGES.WAITLIST.SUBSCRIBE_ERROR_INVALID_EMAIL),
}).strict();

export type SubscribeDTO = z.infer<typeof SubscribeSchema>;
