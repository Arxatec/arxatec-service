// src/modules/cases/features/list_my_cases/presentation/services/list_my_cases.service.ts
import { ListMyCasesRepository } from "../../data/list_my_cases.repository";
import { ListMyCasesResponseDTO } from "../../domain/list_my_cases.dto";

type CurrentUser = { id: number; role: "client" | "lawyer" };

export class ListMyCasesService {
  constructor(private repo = new ListMyCasesRepository()) {}

  async execute(user: CurrentUser): Promise<ListMyCasesResponseDTO[]> {
    console.log("USER", user);
    const result = await this.repo.findCases(user.id, user.role);

    console.log("RESULT", result);

    return result.map((c) => ({
      id: c.id,
      title: c.title,
      status_id: c.status_id,
      category_id: c.category_id,
      is_public: c.is_public,
      created_at: c.created_at,
    }));
  }
}
