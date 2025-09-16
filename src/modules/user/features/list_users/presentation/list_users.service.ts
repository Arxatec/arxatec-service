// src/modules/user/features/list_users/presentation/list_users.service.ts
import { ListUsersRepository } from "../data/list_users.repository";
import { Pagination } from "../../../../../utils/pagination";

export class ListUsersService {
  constructor(private readonly repo = new ListUsersRepository()) {}

  async execute(query: any) {
    const { page, limit, skip } = Pagination.getPaginationParams(query);
    const q =
      typeof query.q === "string" && query.q.trim().length
        ? query.q.trim()
        : undefined;

    const [total, items] = await Promise.all([
      this.repo.count(q),
      this.repo.listMany(skip, limit, q),
    ]);

    const meta = Pagination.buildPaginationMeta(total, page, limit);
    return { items, meta };
  }
}
