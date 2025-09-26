// src/modules/cases/feature/shared/capacity_policy/capacity_policy.service.ts
import prisma from "../../../../../config/prisma_client";
import { AppError } from "../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../constants/messages/case";

export class CapacityPolicyService {
  private readonly MAX_CLIENT_CASES = 5;
  private readonly MAX_LAWYER_CASES = 10;

  private async getStatusIdsExcluding(names: string[]): Promise<string[]> {
    const rows = await prisma.case_statuses.findMany({
      where: { NOT: { name: { in: names } } },
      select: { id: true },
    });
    return rows.map((r) => r.id);
  }

  private async getOpenOrInProgressStatusIds(): Promise<string[]> {
    return this.getStatusIdsExcluding(["cerrado"]);
  }

  private async getInProgressStatusIds(): Promise<string[]> {
    return this.getStatusIdsExcluding(["abierto", "cerrado"]);
  }

  async countClientCasesByStatus(clientId: string): Promise<number> {
    const activeStatusIds = await this.getOpenOrInProgressStatusIds();
    return prisma.cases.count({
      where: {
        service: { client_id: clientId },
        status_id: { in: activeStatusIds },
        archived: false,
      },
    });
  }

  async countLawyerCasesInProgress(lawyerId: string): Promise<number> {
    const inProgressIds = await this.getInProgressStatusIds();
    return prisma.cases.count({
      where: {
        service: { lawyer_id: lawyerId },
        status_id: { in: inProgressIds },
        archived: false,
      },
    });
  }

  async assertClientCanCreate(clientId: string): Promise<void> {
    const count = await this.countClientCasesByStatus(clientId);
    if (count >= this.MAX_CLIENT_CASES) {
      throw new AppError(
        CASE_MESSAGES.LIMIT_OPEN_CLIENT,
        HttpStatusCodes.CONFLICT.code
      );
    }
  }

  async assertLawyerCanTake(lawyerId: string): Promise<void> {
    const count = await this.countLawyerCasesInProgress(lawyerId);
    if (count >= this.MAX_LAWYER_CASES) {
      throw new AppError(
        CASE_MESSAGES.LIMIT_INPROGRESS_LAWYER,
        HttpStatusCodes.CONFLICT.code
      );
    }
  }
}
