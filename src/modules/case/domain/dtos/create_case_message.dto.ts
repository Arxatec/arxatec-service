// src/modules/case/domain/dtos/create_case_message.dto.ts
import { z } from "zod";

export const CreateCaseMessageDto = z.object({
  content: z.string().min(1).max(2000),
});

export type CreateCaseMessageDtoType = z.infer<typeof CreateCaseMessageDto>;
