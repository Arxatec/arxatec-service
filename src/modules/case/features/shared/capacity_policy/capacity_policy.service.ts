// modules/cases/feature/shared/capacity_policy/capacity_policy.service.ts
import { PrismaClient } from "@prisma/client";
import { AppError } from "../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../constants/messages/case";

const prisma = new PrismaClient();

export class CapacityPolicyService {
  private readonly MAX_CLIENT_CASES = 5;
  private readonly MAX_LAWYER_CASES = 10;

  private async getActiveStatusIds(startFromIndex: number): Promise<number[]> {
    const statuses = await prisma.caseStatuses.findMany({
      orderBy: { id: "asc" },
      select: { id: true },
    });

    const active = statuses.slice(startFromIndex, statuses.length - 1);
    return active.map(s => s.id);
  }

  async countClientCasesByStatus(clientId: number): Promise<number> {
    const activeStatusIds = await this.getActiveStatusIds(0);
    return prisma.cases.count({
      where: {
        service: { client_id: clientId },
        status_id: { in: activeStatusIds },
        archived: false,
      },
    });
  }

  async countLawyerCasesInProgress(lawyerId: number): Promise<number> {
    const activeStatusIds = await this.getActiveStatusIds(1);
    return prisma.cases.count({
      where: {
        service: { lawyer_id: lawyerId },
        status_id: { in: activeStatusIds },
        archived: false,
      },
    });
  }

  async assertClientCanCreate(clientId: number): Promise<void> {
    const count = await this.countClientCasesByStatus(clientId);
    if (count >= this.MAX_CLIENT_CASES) {
      throw new AppError(
        CASE_MESSAGES.LIMIT_OPEN_CLIENT,
        HttpStatusCodes.CONFLICT.code
      );
    }
  }

  async assertLawyerCanTake(lawyerId: number): Promise<void> {
    const count = await this.countLawyerCasesInProgress(lawyerId);
    if (count >= this.MAX_LAWYER_CASES) {
      throw new AppError(
        CASE_MESSAGES.LIMIT_INPROGRESS_LAWYER,
        HttpStatusCodes.CONFLICT.code
      );
    }
  }
}
