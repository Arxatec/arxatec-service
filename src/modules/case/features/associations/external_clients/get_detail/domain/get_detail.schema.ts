// src/modules/case/features/associations/external_clients/get_detail/domain/get_detail.schema.ts
import { z } from "zod";
export const ExternalClientIdParamSchema = z.object({ id: z.string().uuid() });
export type ExternalClientIdParamDTO = z.infer<
  typeof ExternalClientIdParamSchema
>;
