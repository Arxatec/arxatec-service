// src/modules/dashboard/client/presentation/services/dashboardClient.service.ts

import { DashboardClientRepository } from '../../data/repository/dashboardClient.repository'

export class DashboardClientService {
  constructor(private readonly repo: DashboardClientRepository) {}

  /* ───────────── SUMMARY KPIs & RECENT CASES ───────────── */
  async getSummary(clientId: number) {
    const [caseStats, recentCases] = await Promise.all([
      this.repo.getCaseCounts(clientId),
      this.repo.getRecentCases(clientId, 1, 5),
    ])

    return {
      ...caseStats,
      recent_cases: recentCases,
    }
  }

  /* ───────────── RECENT CASES (PAGINATED) ───────────── */
  async getRecent(
    clientId: number,
    page: number = 1,
    limit: number = 5
  ) {
    return this.repo.getRecentCases(clientId, page, limit)
  }

  /* ───────────── ACTIVITY (PAGINATED) ───────────── */
  async getActivity(
    clientId: number,
    page: number = 1,
    limit: number = 5
  ) {
    const [histories, messages] = await Promise.all([
      this.repo.getCaseHistories(clientId, page, limit),
      this.repo.getMessages(clientId, page, limit),
    ])

    return { histories, messages }
  }

  /* ───────────── CASES PER MONTH ───────────── */
  async getCasesPerMonth(
    clientId: number,
    months: number = 5
  ) {
    return this.repo.getCasesPerMonth(clientId, months)
  }
}
