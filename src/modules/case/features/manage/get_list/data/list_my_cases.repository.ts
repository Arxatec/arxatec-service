// src/modules/cases/features/manage/list_my_cases/data/list_my_cases.repository.ts
import prisma from "../../../../../../config/prisma_client";

export class ListMyCasesRepository {
  count(userId: string, role: "client" | "lawyer") {
    return prisma.cases.count({
      where: {
        archived: false,
        service:
          role === "client" ? { client_id: userId } : { lawyer_id: userId },
      },
    });
  }

  find(userId: string, role: "client" | "lawyer", skip: number, take: number) {
    return prisma.cases.findMany({
      where: {
        archived: false,
        service:
          role === "client" ? { client_id: userId } : { lawyer_id: userId },
      },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        status_id: true,
        category_id: true,
        is_public: true,
        created_at: true,
      },
      skip,
      take,
    });
  }
}
