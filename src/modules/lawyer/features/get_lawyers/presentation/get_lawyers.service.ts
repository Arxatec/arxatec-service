// src/modules/lawyer/features/get_lawyers/presentation/get_lawyers.service.ts
import { GetLawyersRepository } from "../data/get_lawyers.repository";
import type { GetLawyersQueryDTO } from "../domain/get_lawyers.schema";
import { Pagination } from "../../../../../utils/pagination";

type Filters = { search?: string };

export class GetLawyersService {
  constructor(private repo = new GetLawyersRepository()) {}

  async getAll(query: GetLawyersQueryDTO) {
    const { page, limit, skip } = Pagination.getPaginationParams(query);

    const filters: Filters = {
      ...(query.search && { search: query.search }),
    };

    const [total, rows] = await Promise.all([
      this.repo.count(filters),
      this.repo.find(filters, skip, limit),
    ]);

    const meta = Pagination.buildPaginationMeta(total, page, limit);
    return { items: rows, meta };
  }
}
