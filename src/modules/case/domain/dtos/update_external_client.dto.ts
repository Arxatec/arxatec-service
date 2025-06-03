// src/modules/case/domain/dtos/update_external_client.dto.ts
import { z } from "zod";

export const UpdateExternalClientSchema = z.object({
  full_name: z.string().min(3).max(100).optional(),
  phone:     z.string().min(6).optional(),
  dni:       z.string().min(4).optional(),
  email:     z.string().email().optional(),
});

export type UpdateExternalClientDtoType = z.infer<typeof UpdateExternalClientSchema>;
