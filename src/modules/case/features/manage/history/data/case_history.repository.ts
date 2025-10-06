// src/modules/cases/features/manage/history/data/case_history.repository.ts
import prisma from "../../../../../../config/prisma_client";

export function getHistoryByCaseId(caseId: string) {
  return prisma.case_histories.findMany({
    where: { case_id: caseId },
    orderBy: { created_at: "desc" },
  });
}
