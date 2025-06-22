// modules/cases/feature/shared/case_status/case_status.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CaseStatusRepository {
  async updateStatus(caseId: number, newStatusId: number, changedBy: number, oldStatus: string, newStatus: string) {
    await prisma.cases.update({
      where: { id: caseId },
      data: { status_id: newStatusId },
    });

    await prisma.caseHistories.create({
      data: {
        case_id: caseId,
        changed_by: changedBy,
        field: "status",
        old_value: oldStatus,
        new_value: newStatus,
      },
    });
  }

  async archive(caseId: number, changedBy: number) {
    await prisma.cases.update({
      where: { id: caseId },
      data: { archived: true },
    });

    await prisma.caseHistories.create({
      data: {
        case_id: caseId,
        changed_by: changedBy,
        field: "archived",
        old_value: "false",
        new_value: "true",
      },
    });
  }

  async restore(caseId: number, changedBy: number) {
    await prisma.cases.update({
      where: { id: caseId },
      data: { archived: false },
    });

    await prisma.caseHistories.create({
      data: {
        case_id: caseId,
        changed_by: changedBy,
        field: "archived",
        old_value: "true",
        new_value: "false",
      },
    });
  }

  async getCaseParticipants(caseId: number): Promise<{ client_id: number | null; lawyer_id: number | null } | null> {
    const found = await prisma.cases.findUnique({
      where: { id: caseId },
      select: {
        service: {
          select: {
            client_id: true,
            lawyer_id: true,
          },
        },
      },
    });

    return found?.service ?? null;
  }
}
