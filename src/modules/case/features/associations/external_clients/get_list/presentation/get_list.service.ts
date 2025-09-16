// src/modules/case/features/associations/external_clients/get_list/presentation/get_list.service.ts
import { getExternalClientsRepository as repo } from "../data/get_list.repository";
import { Pagination } from "../../../../../../../utils/pagination";

export const getExternalClientsService = async (
  userDetailId: string,
  query: { page?: string; limit?: string; q?: string }
) => {
  const { page, limit, skip } = Pagination.getPaginationParams(query);
  const total = await repo.countByLawyer(userDetailId, query.q);
  const clients = await repo.findManyByLawyer(
    userDetailId,
    skip,
    limit,
    query.q
  );
  const meta = Pagination.buildPaginationMeta(total, page, limit);

  return { clients, meta };
};
