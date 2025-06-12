import { DashboardLawyerRepository } from "../../data/repository/dashboardLawyer.repository";

export class DashboardLawyerService {
  constructor(private readonly repo: DashboardLawyerRepository) {}

  /* ───────────── SUMMARY ───────────── */
  getSummary(lawyerId: number) {
    return this.repo.getSummaryCounts(lawyerId);
  }
}
