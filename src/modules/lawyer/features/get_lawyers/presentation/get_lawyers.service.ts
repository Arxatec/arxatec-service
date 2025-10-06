// src/modules/lawyer/features/get_lawyers/presentation/get_lawyers.service.ts
import { Pagination } from "../../../../../utils/pagination";
import { countLawyers, findLawyers } from "../data/get_lawyers.repository";
import {
  GetLawyersQueryRequest,
  GetLawyersResponse,
} from "../domain/get_lawyers.payload";

export async function getLawyersService(
  query: GetLawyersQueryRequest
): Promise<GetLawyersResponse> {
  const { page, limit, skip } = Pagination.getPaginationParams(query);
  const filters = { ...(query.search && { search: query.search }) };

  const [total, rows] = await Promise.all([
    countLawyers(filters),
    findLawyers(filters, skip, limit),
  ]);

  const meta = Pagination.buildPaginationMeta(total, page, limit);
  return { items: rows, meta };
}
