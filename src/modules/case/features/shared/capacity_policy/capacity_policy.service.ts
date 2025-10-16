// src/modules/cases/feature/shared/capacity_policy/capacity_policy.service.ts
import prisma from "../../../../../config/prisma_client";
import { AppError } from "../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../constants/messages/case";
import { case_status } from "@prisma/client";

export const MAX_CLIENT_CASES = 5;
export const MAX_LAWYER_CASES = 10;

function getOpenOrInProgressStatuses(): case_status[] {
  return [case_status.open, case_status.in_progress];
}

function getInProgressStatuses(): case_status[] {
  return [case_status.in_progress];
}

export async function countClientCasesByStatus(
  clientId: string
): Promise<number> {
  const activeStatuses = getOpenOrInProgressStatuses();
  return prisma.cases.count({
    where: {
      service: { client_id: clientId },
      status: { in: activeStatuses },
      archived: false,
    },
  });
}

export async function countLawyerCasesInProgress(
  lawyerId: string
): Promise<number> {
  const inProgressStatuses = getInProgressStatuses();
  return prisma.cases.count({
    where: {
      service: { lawyer_id: lawyerId },
      status: { in: inProgressStatuses },
      archived: false,
    },
  });
}

export async function assertClientCanCreate(clientId: string): Promise<void> {
  const count = await countClientCasesByStatus(clientId);
  /* if (count >= MAX_CLIENT_CASES) {
    throw new AppError(
      CASE_MESSAGES.LIMIT_OPEN_CLIENT,
      HttpStatusCodes.CONFLICT.code
    );
  } */
}

export async function assertLawyerCanTake(lawyerId: string): Promise<void> {
  const count = await countLawyerCasesInProgress(lawyerId);
  /* if (count >= MAX_LAWYER_CASES) {
    throw new AppError(
      CASE_MESSAGES.LIMIT_INPROGRESS_LAWYER,
      HttpStatusCodes.CONFLICT.code
    );
  } */
}
