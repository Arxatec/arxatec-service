// src/modules/dashboard/client/data/repository/dashboardClient.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface ClientDashboardCounts {
  totalCases: number;
  casesInReview: number;
  casesInProcess: number;
  casesClosed: number;
  casesArchived: number;
}

export class DashboardClientRepository {
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

  async getSummaryCounts(clientId: number): Promise<ClientDashboardCounts> {
    const statusIds = await this.getStatusIds();

    const [totalCases, casesByStatus, casesArchived] = await prisma.$transaction(
      [
        prisma.cases.count({
          where: { service: { client_id: clientId }, archived: false },
        }),

        prisma.cases.groupBy({
          by: ["status_id"],
          where: { service: { client_id: clientId }, archived: false },
          _count: { _all: true },
          orderBy: { status_id: "asc" },
        }),

        prisma.cases.count({
          where: { service: { client_id: clientId }, archived: true },
        }),
      ],
    );

    const statusCountMap = casesByStatus.reduce<Record<number, number>>(
      (map, row) => {
        const count = (row._count as { _all: number })._all; // type-narrowing
        map[row.status_id] = count;
        return map;
      },
      {},
    );

    return {
      totalCases,
      casesInReview:  statusCountMap[statusIds["En revisión"]] ?? 0,
      casesInProcess: statusCountMap[statusIds["En proceso"]]  ?? 0,
      casesClosed:    statusCountMap[statusIds["Cerrado"]]     ?? 0,
      casesArchived,
    };
  }
}
