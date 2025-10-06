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

  const [total, rows] = await Promise.all([
    countByLawyer(userDetailId, query.search),
    findManyByLawyer(userDetailId, skip, limit, query.search),
  ]);

  const clients: ExternalClientListItem[] = rows.map((c) => ({
    id: c.id,
    full_name: c.full_name,
    phone: c.phone,
    dni: c.dni,
    email: c.email,
    profile_image: c.profile_image,
  }));

  const meta = Pagination.buildPaginationMeta(total, page, limit);
  return { clients, meta };
}
