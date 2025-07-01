// src/modules/cases/features/list_my_cases/data/list_my_cases.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ListMyCasesRepository {
  async findCases(userId: number, role: "client" | "lawyer") {
    return prisma.cases.findMany({
      where: {
        archived: false,
        service: {
          ...(role === "client" 
            ? { client_id: userId }
            : { lawyer_id: userId }),
        },
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
    });
  }
}