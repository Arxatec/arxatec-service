// src/modules/lawyer/features/get_lawyers/domain/get_lawyers.payload.ts
import z from "zod";
import { GetLawyersQuerySchema } from "./get_lawyers.schema";

export type GetLawyersQueryRequest = z.infer<typeof GetLawyersQuerySchema>;

export type GetLawyersItem = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  profile_image: string | null;
  lawyer_details: unknown;
};

export type GetLawyersResponse = {
  items: GetLawyersItem[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};
