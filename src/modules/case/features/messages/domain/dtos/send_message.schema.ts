// src/modules/case/features/messages/domain/dtos/send_messages.schema.ts

import { z } from "zod";

export const SendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required").max(1000),
});