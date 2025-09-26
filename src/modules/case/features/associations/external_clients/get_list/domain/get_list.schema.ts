// src/modules/case/features/associations/external_clients/get_list/domain/get_list.schema.ts
import { z } from "zod";

export const GetExternalClientsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  q: z.string().trim().min(1).optional(),
});

export type GetExternalClientsQueryDTO = z.infer<
  typeof GetExternalClientsQuerySchema
>;
