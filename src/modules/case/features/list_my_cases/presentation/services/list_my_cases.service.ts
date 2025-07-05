// src/modules/cases/features/list_my_cases/presentation/services/list_my_cases.service.ts
import { ListMyCasesRepository } from "../../data/list_my_cases.repository";
import { ListMyCasesResponseDTO } from "../../domain/list_my_cases.dto";

type CurrentUser = { id: number; role: "client" | "lawyer" };

export class ListMyCasesService {
  constructor(private repo = new ListMyCasesRepository()) {}

  async execute(user: CurrentUser): Promise<ListMyCasesResponseDTO[]> {
    const cases = await this.repo.findCases(user.id, user.role);

    return cases.map(({ id, title, status_id, category_id, is_public, created_at }) => ({
      id,
      title,
      status_id,
      category_id,
      is_public,
      created_at,
    }));
  }
}