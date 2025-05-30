// src/modules/dashboard/lawyer/presentation/services/dashboardLawyer.service.ts
import { DashboardLawyerRepository } from "../../data/repository/dashboardLawyer.repository";

export class DashboardLawyerService {
  constructor(private readonly repo: DashboardLawyerRepository) {}

  /* ───────────── SUMMARY KPIs, CASES, STATUES, CLIENT EXTERNAL───────────── */

  async getSummary(lawyerId: number) {
    const [caseStats, recentCases, externalClients] = await Promise.all([
      this.repo.getCaseCounts(lawyerId),
      this.repo.getRecentCases(lawyerId, 1, 5),
      this.repo.getExternalClientCount(lawyerId),
    ]);

    return {
      ...caseStats,
      recent_cases: recentCases,
      external_clients: externalClients,
    };
  }
  /* ───────────── CASES RECENT FOR PAGINATION───────────── */

  async getRecent(
    lawyerId: number,
    page: number = 1,
    limit: number = 5
  ) {
    return this.repo.getRecentCases(lawyerId, page, limit);
  }
  /* ───────────── STATUES AND MESSAGES FOR PAGINATION──────────── */
  async getActivity(
    lawyerId: number,
    page: number = 1,
    limit: number = 5
  ) {
    const [histories, messages] = await Promise.all([
      this.repo.getCaseHistories(lawyerId, page, limit),
      this.repo.getMessages(lawyerId, page, limit),
    ]);

    return { histories, messages };
  }
/* ───────────── COUNT THE CASES PER MONTH──────────── */

  async getCasesPerMonth(
    lawyerId: number,
    months: number = 5
  ) {
    return this.repo.getCasesPerMonth(lawyerId, months);
  }
}
