// src/modules/user/features/list_users/domain/list_users.payload.ts
import z from "zod";
import { ListUsersQuerySchema } from "./list_users.schema";

export type ListUsersQueryRequest = z.infer<typeof ListUsersQuerySchema>;

export type ListUsersItem = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type ListUsersResponse = {
  items: ListUsersItem[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};
