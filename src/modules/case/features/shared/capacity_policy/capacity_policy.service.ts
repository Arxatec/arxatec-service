// src/modules/cases/feature/shared/capacity_policy/capacity_policy.service.ts
import prisma from "../../../../../config/prisma_client";
import { AppError } from "../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../constants/messages/case";
import { case_status } from "@prisma/client";

export class CapacityPolicyService {
  private readonly MAX_CLIENT_CASES = 5;
  private readonly MAX_LAWYER_CASES = 10;

  // Estados activos para clientes (abierto y en progreso)
  private getOpenOrInProgressStatuses(): case_status[] {
    return [case_status.abierto, case_status.en_progreso];
  }

  // Estados en progreso para abogados (solo en progreso)
  private getInProgressStatuses(): case_status[] {
    return [case_status.en_progreso];
  }

  async countClientCasesByStatus(clientId: string): Promise<number> {
    const activeStatuses = this.getOpenOrInProgressStatuses();
    return prisma.cases.count({
      where: {
        service: { client_id: clientId },
        status: { in: activeStatuses },
        archived: false,
      },
    });
  }

  async countLawyerCasesInProgress(lawyerId: string): Promise<number> {
    const inProgressStatuses = this.getInProgressStatuses();
    return prisma.cases.count({
      where: {
        service: { lawyer_id: lawyerId },
        status: { in: inProgressStatuses },
        archived: false,
      },
    });
  }

  async assertClientCanCreate(clientId: string): Promise<void> {
    const count = await this.countClientCasesByStatus(clientId);
    /* if (count >= this.MAX_CLIENT_CASES) {
      throw new AppError(
        CASE_MESSAGES.LIMIT_OPEN_CLIENT,
        HttpStatusCodes.CONFLICT.code
      );
    } */
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
