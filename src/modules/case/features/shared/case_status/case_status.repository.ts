// src/modules/cases/feature/shared/case_status/case_status.repository.ts
import prisma from "../../../../../config/prisma_client";
import { case_status } from "@prisma/client";

export async function updateCaseStatus(
  caseId: string,
  newStatus: case_status,
  changedBy: string,
  oldStatus: case_status
): Promise<void> {
  await prisma.$transaction([
    prisma.cases.update({
      where: { id: caseId },
      data: { status: newStatus },
    }),
    prisma.case_histories.create({
      data: {
        case_id: caseId,
        changed_by: changedBy,
        field: "status",
        old_value: oldStatus,
        new_value: newStatus,
      },
    }),
  ]);
}

export async function archiveCase(
  caseId: string,
  changedBy: string
): Promise<void> {
  await prisma.$transaction([
    prisma.cases.update({
      where: { id: caseId },
      data: { archived: true },
    }),
    prisma.case_histories.create({
      data: {
        case_id: caseId,
        changed_by: changedBy,
        field: "archived",
        old_value: "false",
        new_value: "true",
      },
    }),
  ]);
}

export async function restoreCase(
  caseId: string,
  changedBy: string
): Promise<void> {
  await prisma.$transaction([
    prisma.cases.update({
      where: { id: caseId },
      data: { archived: false },
    }),
    prisma.case_histories.create({
      data: {
        case_id: caseId,
        changed_by: changedBy,
        field: "archived",
        old_value: "true",
        new_value: "false",
      },
    }),
  ]);
}

export async function getCaseParticipants(
  caseId: string
): Promise<{ client_id: string | null; lawyer_id: string | null } | null> {
  const found = await prisma.cases.findUnique({
    where: { id: caseId },
    select: { service: { select: { client_id: true, lawyer_id: true } } },
  });
  return found?.service ?? null;
}

export async function getCurrentCaseStatus(
  caseId: string
): Promise<case_status | null> {
  const caseData = await prisma.cases.findUnique({
    where: { id: caseId },
    select: { status: true },
  });
  return caseData?.status ?? null;
}
