// src/modules/case/features/explore_cases/presentation/services/explore_cases.service.ts
import { ExploreCasesRepository } from "../../data/explore_cases.repository";

type ExploreFilters = {
  category_id?: number;
  status_id?: number;
  lawyerId?: number | null;
  is_public?: boolean;
  archived?: boolean;
};

export class ExploreCasesService {
  constructor(private repo = new ExploreCasesRepository()) {}

  /* ---------- Catálogos ---------- */
  getCategories() {
    return this.repo.getAllCategories();
  }

  getStatuses() {
    return this.repo.getAllStatuses();
  }

  /* ---------- Consulta pública ---------- */
  explore(filters: ExploreFilters) {
    return this.repo.exploreCases({ is_public: true, ...filters });
  }
}
