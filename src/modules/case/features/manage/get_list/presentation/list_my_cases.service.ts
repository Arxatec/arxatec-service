// src/modules/cases/features/manage/list_my_cases/presentation/list_my_cases.service.ts
import { Pagination } from "../../../../../../utils/pagination";
import { ListMyCasesQueryDTO } from "../domain/list_my_cases.schema";
import { countMyCases, findMyCases } from "../data/list_my_cases.repository";
import type { ListMyCasesResponse } from "../domain/list_my_cases.payload";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export async function listMyCasesService(
  user: CurrentUser,
  query: ListMyCasesQueryDTO
): Promise<ListMyCasesResponse> {
  const { page, limit, skip } = Pagination.getPaginationParams(query);

  const filters = {
    search: query.search,
    category: query.category,
    status: query.status,
  };

  const [total, rows] = await Promise.all([
    countMyCases(user.id, user.role, filters),
    findMyCases(user.id, user.role, skip, limit, filters),
  ]);

  const items = rows.map(
    ({ id, title, status, category, is_public, created_at, service }) => ({
      id,
      title,
      status,
      category,
      is_public,
      created_at,
      lawyer_id: service.lawyer_id,
    })
  );

  const meta = Pagination.buildPaginationMeta(total, page, limit);
  return { items, meta };
}
