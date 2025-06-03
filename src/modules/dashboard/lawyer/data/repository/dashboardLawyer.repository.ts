// src/modules/dashboard/lawyer/data/repository/dashboardLawyer.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DashboardLawyerRepository {

  async getStatuses() {
    return prisma.caseStatuses.findMany({
      orderBy: { id: "asc" },
    });
  }
 /* ───────────── LAWYER CASE STATUS COUNTS ───────────── */
async getCaseCounts(lawyerId: number) {
  const statuses = await this.getStatuses()
  if (statuses.length < 3) {
    throw new Error("Deben haber al menos 3 estados configurados: abierto, tomado y cerrado.")
  }
  const openId   = statuses[0].id
  const takenId  = statuses[1].id
  const closedId = statuses[statuses.length - 1].id

  const [{ _count: total }] = await prisma.cases.aggregate({
    _count: true,
    where: { service: { lawyer_id: lawyerId } },
  }).then(r => [r])

  const [openCount, takenCount, closedCount, archivedCount] = await Promise.all([
    prisma.cases.count({
      where: {
        service:   { lawyer_id: lawyerId },
        status_id: openId,
      },
    }),
    prisma.cases.count({
      where: {
        service:   { lawyer_id: lawyerId },
        status_id: takenId,
      },
    }),
    prisma.cases.count({
      where: {
        service:   { lawyer_id: lawyerId },
        status_id: closedId,
      },
    }),
    prisma.cases.count({
      where: {
        service:  { lawyer_id: lawyerId },
        archived: true,
      },
    }),
  ])

  return {
    total,
    open:     openCount,
    taken:    takenCount,
    closed:   closedCount,
    archived: archivedCount,
  }
}


  /* ───────────── CASES RECENT ───────────── */

  async getRecentCases(
    lawyerId: number,
    page = 1,
    limit = 5
  ) {
    const skip = (page - 1) * limit;
    return prisma.cases.findMany({
      where: { service: { lawyer_id: lawyerId } },
      take: limit,
      skip,
      orderBy: { created_at: "desc" },
      include: {
        service: true,
        status: true,
        category: true,
      },
    });
  }

  /* ───────────── CLIENT EXTERNAL ───────────── */
  async getExternalClientCount(lawyerUserId: number) {
    return prisma.externalClients.count({
      where: { user_detail: { user_id: lawyerUserId } },
    });
  }

  /* ───────────── HISTORY CASES───────────── */
  async getCaseHistories(
    lawyerId: number,
    page = 1,
    limit = 5
  ) {
    const skip = (page - 1) * limit;
    return prisma.caseHistories.findMany({
      where: { changed_by: lawyerId },
      take: limit,
      skip,
      orderBy: { created_at: "desc" },
      include: {
        case: {
          select: { id: true, title: true },
        },
      },
    });
  }

  /* ───────────── HISTORY MESSAGES ───────────── */
  async getMessages(
    lawyerId: number,
    page = 1,
    limit = 5
  ) {
    const skip = (page - 1) * limit;
    return prisma.messages.findMany({
      where: {
        sent_by: "lawyer",
        service: { lawyer_id: lawyerId },
      },
      take: limit,
      skip,
      orderBy: { created_at: "desc" },
    });
  }

  /* ───────────── CASES FOR MOUNTS ───────────── */
  async getCasesPerMonth(
    lawyerId: number,
    months = 5
  ): Promise<Array<{ month: string; count: number }>> {
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth() - (months - 1),
      1,
      0,
      0,
      0,
      0
    );

    const cases = await prisma.cases.findMany({
      where: {
        service: { lawyer_id: lawyerId },
        created_at: { gte: start },
      },
      select: { created_at: true },
    });

    const counts: Record<string, number> = {};
    cases.forEach(({ created_at }) => {
      const key = `${created_at.getFullYear()}-${String(
        created_at.getMonth() + 1
      ).padStart(2, "0")}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const result: Array<{ month: string; count: number }> = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      result.push({ month: key, count: counts[key] || 0 });
    }

    return result;
  }
}
