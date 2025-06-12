// src/modules/dashboard/lawyer/data/repository/dashboardLawyer.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export interface LawyerDashboardCounts {
  totalClients: number;
  totalExternalClients: number;
  totalCases: number;
  casesInReview: number;
  casesInProcess: number;
  casesClosed: number;
  casesArchived: number;
  externalClientsArchived: number;
}

export class DashboardLawyerRepository {
  private async getStatusIds() {
    const statuses = await prisma.caseStatuses.findMany({
      where: { name: { in: ["En revisión", "En proceso", "Cerrado"] } },
      select: { id: true, name: true },
    });

    return statuses.reduce<Record<string, number>>((map, s) => {
      map[s.name] = s.id;
      return map;
    }, {});
  }

  async getSummaryCounts(lawyerId: number): Promise<LawyerDashboardCounts> {
    const statusIds = await this.getStatusIds();

    const clientsGroupedPromise = prisma.services.groupBy({
      by: ["client_id"],
      where: { lawyer_id: lawyerId },
    });

    const [
      clientsGrouped,
      totalExternalClients,
      totalCases,
      casesByStatus,
      casesArchived,
      externalClientsArchived,
    ] = await prisma.$transaction([
      clientsGroupedPromise,
      prisma.externalClients.count({
        where: { user_detail: { user_id: lawyerId }, archived: false },
      }),
      prisma.cases.count({
        where: { service: { lawyer_id: lawyerId }, archived: false },
      }),
      prisma.cases.groupBy({
        by: ["status_id"],
        where: { service: { lawyer_id: lawyerId }, archived: false },
        _count: { _all: true },
        orderBy: { status_id: "asc" }, // requerido por Prisma 5
      }),
      prisma.cases.count({
        where: { service: { lawyer_id: lawyerId }, archived: true },
      }),
      prisma.externalClients.count({
        where: { user_detail: { user_id: lawyerId }, archived: true },
      }),
    ]);

    const totalClients = clientsGrouped.length;

    const statusCountMap = casesByStatus.reduce<Record<number, number>>(
      (map, row) => {
        const count = (row._count as { _all: number })._all;
        map[row.status_id] = count;
        return map;
      },
      {},
    );

    return {
      totalClients,
      totalExternalClients,
      totalCases,
      casesInReview: statusCountMap[statusIds["En revisión"]] ?? 0,
      casesInProcess: statusCountMap[statusIds["En proceso"]] ?? 0,
      casesClosed:    statusCountMap[statusIds["Cerrado"]]    ?? 0,
      casesArchived,
      externalClientsArchived,
    };
  }
}
