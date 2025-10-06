// src/modules/case/features/associations/external_clients/get_detail/domain/get_detail.payload.ts
import z from "zod";
import { ExternalClientIdParamSchema } from "./get_detail.schema";

export type ExternalClientIdRequest = z.infer<
  typeof ExternalClientIdParamSchema
>;

export interface ExternalClientDetailResponse {
  id: string;
  profile_image: string | null;
  full_name: string;
  email: string | null;
  phone: string;
  dni: string;
  created_at: Date;
  archived: boolean;
}
