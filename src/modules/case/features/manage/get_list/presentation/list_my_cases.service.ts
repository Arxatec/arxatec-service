// src/modules/cases/features/manage/list_my_cases/presentation/list_my_cases.service.ts
import { ListMyCasesRepository } from "../data/list_my_cases.repository";
import { Pagination } from "../../../../../../utils/pagination";

type CurrentUser = { id: string; role: "client" | "lawyer" };

export class ListMyCasesService {
  constructor(private repo = new ListMyCasesRepository()) {}

  async execute(user: CurrentUser, query: any) {
    const { page, limit, skip } = Pagination.getPaginationParams(query);

    const [total, rows] = await Promise.all([
      this.repo.count(user.id, user.role),
      this.repo.find(user.id, user.role, skip, limit),
    ]);

    const items = rows.map(
      ({ id, title, status_id, category_id, is_public, created_at }) => ({
        id,
        title,
        status_id,
        category_id,
        is_public,
        created_at,
      })
    );

    const meta = Pagination.buildPaginationMeta(total, page, limit);
    return { items, meta };
  }
}
