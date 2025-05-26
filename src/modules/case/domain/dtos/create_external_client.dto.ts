// src/modules/case/domain/dtos/create_external_client.dto.ts
import { z } from "zod";

export const CreateExternalClientDto = z.object({
  full_name: z.string().min(3).max(100),
  phone:     z.string().min(6),
  dni:       z.string().min(4),
  email:     z.string().email().optional(),
});

export type CreateExternalClientDtoType = z.infer<typeof CreateExternalClientDto>;
