// src/modules/cases/features/manage/reopen_case/data/reopen_case.repository.ts
import prisma from "../../../../../../config/prisma_client";

export function findCaseById(id: string) {
  return prisma.cases.findUnique({
    where: { id },
    select: {
      id: true,
      archived: true,
      service: { select: { client_id: true, lawyer_id: true } },
    },
  });
}

export async function restoreCase(id: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.case_histories.create({
      data: {
        case_id: id,
        changed_by: userId,
        field: "archived",
        old_value: "true",
        new_value: "false",
        note: "Case reopened",
      },
    });
    return tx.cases.update({ where: { id }, data: { archived: false } });
  });
}
