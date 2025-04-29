// src/modules/case/domain/dtos/create_case_message.dto.ts

import { z } from "zod";

export const CreateCaseMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message is too long"),
});

export type CreateCaseMessageDto = z.infer<typeof CreateCaseMessageSchema>;
