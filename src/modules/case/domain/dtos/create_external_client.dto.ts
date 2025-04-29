// src/modules/case/domain/dtos/create_external_client.dto.ts
import { z } from "zod";

export const CreateExternalClientDto = z.object({
  first_name: z.string().min(2).max(60),
  last_name: z.string().min(2).max(60),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional()
});
export type CreateExternalClientDto = z.infer<typeof CreateExternalClientDto>;
