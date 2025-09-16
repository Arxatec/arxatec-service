// modules/cases/feature/shared/case_status/case_status.repository.ts
import prisma from "../../../../../config/prisma_client";

export class CaseStatusRepository {
  async updateStatus(
    caseId: string,
    newStatusId: string,
    changedBy: string,
    oldStatus: string,
    newStatus: string
  ) {
    await prisma.cases.update({
      where: { id: caseId },
      data: { status_id: newStatusId },
    });

    await prisma.case_histories.create({
      data: {
        case_id: caseId,
        changed_by: changedBy,
        field: "status",
        old_value: oldStatus,
        new_value: newStatus,
      },
    });
  }

  async archive(caseId: string, changedBy: string) {
    await prisma.cases.update({
      where: { id: caseId },
      data: { archived: true },
    });

    await prisma.case_histories.create({
      data: {
        case_id: caseId,
        changed_by: changedBy,
        field: "archived",
        old_value: "false",
        new_value: "true",
      },
    });
  }

  async restore(caseId: string, changedBy: string) {
    await prisma.cases.update({
      where: { id: caseId },
      data: { archived: false },
    });

    await prisma.case_histories.create({
      data: {
        case_id: caseId,
        changed_by: changedBy,
        field: "archived",
        old_value: "true",
        new_value: "false",
      },
    });
  }

  async getCaseParticipants(
    caseId: string
  ): Promise<{ client_id: string | null; lawyer_id: string | null } | null> {
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
