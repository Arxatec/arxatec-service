// src/modules/user/features/list_users/presentation/list_users.service.ts
import { Pagination } from "../../../../../utils/pagination";
import { countUsers, listUsersRepo } from "../data/list_users.repository";
import {
  ListUsersQueryRequest,
  ListUsersResponse,
} from "../domain/list_users.payload";

export async function listUsersService(
  query: ListUsersQueryRequest
): Promise<ListUsersResponse> {
  const { page, limit, skip } = Pagination.getPaginationParams(query);
  const q = query.q?.trim() || undefined;

  const [total, items] = await Promise.all([
    countUsers(q),
    listUsersRepo(skip, limit, q),
  ]);
  const meta = Pagination.buildPaginationMeta(total, page, limit);

  return { items, meta };
}
