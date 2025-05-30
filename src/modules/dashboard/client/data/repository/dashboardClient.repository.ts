// src/modules/dashboard/client/data/repository/dashboardClient.repository.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class DashboardClientRepository {

  async getStatuses() {
    return prisma.caseStatuses.findMany({
      orderBy: { id: 'asc' },
    })
  }

  /* ───────────── CASE STATUS COUNTS ───────────── */
  async getCaseCounts(clientId: number) {
    const statuses = await this.getStatuses()
    const initialId     = statuses[0].id
    const penultimateId = statuses[statuses.length - 2].id
    const finalId       = statuses[statuses.length - 1].id
    const inProgressIds = statuses
      .slice(1, statuses.length - 2)
      .map(s => s.id)

    const [{ _count: total }] = await prisma.cases.aggregate({
      _count: true,
      where: { service: { client_id: clientId } },
    }).then(r => [r])

    const [ active, closed, archived, inProgress ] = await Promise.all([
      prisma.cases.count({
        where: {
          service: { client_id: clientId },
          status_id: { gte: initialId + 1, lt: penultimateId },
        },
      }),
      prisma.cases.count({
        where: {
          service: { client_id: clientId },
          status_id: penultimateId,
        },
      }),
      prisma.cases.count({
        where: {
          service: { client_id: clientId },
          OR: [{ status_id: finalId }, { archived: true }],
        },
      }),
      prisma.cases.count({
        where: {
          service: { client_id: clientId },
          status_id: { in: inProgressIds },
        },
      }),
    ])

    return {
      total,
      active,
      closed,
      archived,
      in_progress: inProgress,
    }
  }

  /* ───────────── RECENT CASES ───────────── */
  async getRecentCases(
    clientId: number,
    page = 1,
    limit = 5
  ) {
    const skip = (page - 1) * limit
    return prisma.cases.findMany({
      where: { service: { client_id: clientId } },
      take: limit,
      skip,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        created_at: true,
      },
    })
  }

  /* ───────────── CASE HISTORY ───────────── */
  async getCaseHistories(
    clientId: number,
    page = 1,
    limit = 5
  ) {
    const skip = (page - 1) * limit
    return prisma.caseHistories.findMany({
      where: {
        case: { service: { client_id: clientId } },
      },
      take: limit,
      skip,
      orderBy: { created_at: 'desc' },
      include: {
        case: { select: { id: true, title: true } },
      },
    })
  }

  /* ───────────── CLIENT MESSAGES ───────────── */
  async getMessages(
    clientId: number,
    page = 1,
    limit = 5
  ) {
    const skip = (page - 1) * limit
    return prisma.messages.findMany({
      where: {
        service: { client_id: clientId },
        sent_by: 'client',
      },
      take: limit,
      skip,
      orderBy: { created_at: 'desc' },
    })
  }

  /* ───────────── CASES PER MONTH ───────────── */
  async getCasesPerMonth(
    clientId: number,
    months = 5
  ): Promise<Array<{ month: string; count: number }>> {
    const now   = new Date()
    const start = new Date(
      now.getFullYear(),
      now.getMonth() - (months - 1),
      1
    )

    const cases = await prisma.cases.findMany({
      where: {
        service: { client_id: clientId },
        created_at: { gte: start },
      },
      select: { created_at: true },
    })

    const counts: Record<string, number> = {}
    cases.forEach(({ created_at }) => {
      const key = `${created_at.getFullYear()}-${String(created_at.getMonth() + 1).padStart(2, '0')}`
      counts[key] = (counts[key] || 0) + 1
    })

    return Array.from({ length: months }).map((_, i) => {
      const d   = new Date(start.getFullYear(), start.getMonth() + i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return { month: key, count: counts[key] || 0 }
    })
  }

}
