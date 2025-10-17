// src/modules/case/features/associations/external_clients/get_list/presentation/get_list.service.ts
import { Pagination } from "../../../../../../../utils/pagination";
import { countByLawyer, findManyByLawyer } from "../data/get_list.repository";
import type {
  GetExternalClientsRequest,
  GetExternalClientsResponse,
  ExternalClientListItem,
} from "../domain/get_list.payload";

export async function getExternalClientsService(
  userDetailId: string,
  query: GetExternalClientsRequest
): Promise<GetExternalClientsResponse> {
  const { page, limit, skip } = Pagination.getPaginationParams(query as any);

  let take: number | undefined = limit;
  if (Boolean(query.all) === true) take = undefined;

  const [total, rows] = await Promise.all([
    countByLawyer(userDetailId, query.search),
    findManyByLawyer(userDetailId, skip, take, query.search),
  ]);

  const clients: ExternalClientListItem[] = rows.map((c) => ({
    id: c.id,
    full_name: c.full_name,
    phone: c.phone,
    dni: c.dni,
    email: c.email,
    profile_image: c.profile_image,
  }));

  const raw = Pagination.buildPaginationMeta(total, page, limit);
  const meta = {
    total: raw.totalItems,
    total_pages: raw.totalPages,
    page: raw.currentPage,
    limit: raw.pageSize,
    has_next_page: raw.hasNextPage,
    has_prev_page: raw.hasPrevPage,
  };

  return { clients, meta };
}
