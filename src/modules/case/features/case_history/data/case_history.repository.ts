import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class GetCaseHistoryRepository {
  async getHistoryByCaseId(caseId: number) {
    return prisma.caseHistories.findMany({
      where: { case_id: caseId },
      orderBy: { created_at: "desc" },
    });
  }
}
