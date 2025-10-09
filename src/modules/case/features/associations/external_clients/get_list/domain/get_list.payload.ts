// src/modules/case/features/associations/external_clients/get_list/domain/get_list.payload.ts
import z from "zod";
import { GetExternalClientsQuerySchema } from "./get_list.schema";

export type GetExternalClientsRequest = z.infer<
  typeof GetExternalClientsQuerySchema
>;

export interface ExternalClientListItem {
  id: string;
  full_name: string;
  phone: string;
  dni: string;
  email: string | null;
  profile_image: string | null;
}

export interface ExternalClientListMeta {
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface GetExternalClientsResponse {
  clients: ExternalClientListItem[];
  meta: ExternalClientListMeta;
}
