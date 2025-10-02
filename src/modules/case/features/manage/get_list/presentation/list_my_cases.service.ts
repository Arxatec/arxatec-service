// src/modules/cases/features/manage/list_my_cases/presentation/list_my_cases.service.ts
import { ListMyCasesRepository } from "../data/list_my_cases.repository";
import { Pagination } from "../../../../../../utils/pagination";
import { ListMyCasesQueryDTO } from "../domain/list_my_cases.schema";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export class ListMyCasesService {
  constructor(private repo = new ListMyCasesRepository()) {}

  async execute(user: CurrentUser, query: ListMyCasesQueryDTO) {
    const { page, limit, skip } = Pagination.getPaginationParams(query);

    const filters = {
      search: query.search,
      category: query.category,
      status: query.status,
    };

    const [total, rows] = await Promise.all([
      this.repo.count(user.id, user.role, filters),
      this.repo.find(user.id, user.role, skip, limit, filters),
    ]);

    const items = rows.map(
      ({ id, title, status, category, is_public, created_at }) => ({
        id,
        title,
        status,
        category,
        is_public,
        created_at,
      })
    );

    const meta = Pagination.buildPaginationMeta(total, page, limit);
    return { items, meta };
  }
}
