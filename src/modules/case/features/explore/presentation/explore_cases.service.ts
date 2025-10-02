// src/modules/case/features/explore_cases/presentation/explore_cases.service.ts
import { ExploreCasesRepository } from "../data/explore_cases.repository";
import { Pagination } from "../../../../../utils/pagination";

type ExploreFilters = {
  category?: string;
  status?: string;
  lawyerId?: string | null;
  is_public?: boolean;
  archived?: boolean;
  search?: string;
};

export class ExploreCasesService {
  constructor(private repo = new ExploreCasesRepository()) {}

  getCategories() {
    return this.repo.getAllCategories();
  }

  getStatuses() {
    return this.repo.getAllStatuses();
  }

  async explore(filters: ExploreFilters, query: any) {
    const { page, limit, skip } = Pagination.getPaginationParams(query);

    const safeFilters: ExploreFilters = {
      ...filters,
      is_public: true,
    };

    const [total, rows] = await Promise.all([
      this.repo.count(safeFilters),
      this.repo.find(safeFilters, skip, limit),
    ]);

    const meta = Pagination.buildPaginationMeta(total, page, limit);

    return { items: rows, meta };
  }
}
