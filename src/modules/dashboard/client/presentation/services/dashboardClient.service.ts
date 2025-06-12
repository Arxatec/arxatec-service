// src/modules/dashboard/client/presentation/services/dashboardClient.service.ts
import { DashboardClientRepository } from "../../data/repository/dashboardClient.repository";

export class DashboardClientService {
  constructor(private readonly repo: DashboardClientRepository) {}

  /* ───────────── SUMMARY ───────────── */
  getSummary(clientId: number) {
    return this.repo.getSummaryCounts(clientId);
  }
}
