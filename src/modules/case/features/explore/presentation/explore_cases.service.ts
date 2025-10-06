// src/modules/case/features/explore_cases/presentation/explore_cases.service.ts
import {
  Filters,
  count,
  find,
  getAllCategories,
  getAllStatuses,
} from "../data/explore_cases.repository";
import { Pagination } from "../../../../../utils/pagination";

export function listCategories() {
  return getAllCategories();
}

export function listStatuses() {
  return getAllStatuses();
}

export async function exploreCases(
  filters: Filters,
  query: { page: number; limit: number }
) {
  const { page, limit, skip } = Pagination.getPaginationParams(query);
  const safeFilters: Filters = { ...filters, is_public: true, archived: false };
  const [total, rows] = await Promise.all([
    count(safeFilters),
    find(safeFilters, skip, limit),
  ]);
  const meta = Pagination.buildPaginationMeta(total, page, limit);
  return { items: rows, meta };
}
