// src/modules/cases/features/manage/archive/data/archive_case.repository.ts
import prisma from "../../../../../../config/prisma_client";

export function findCaseLight(id: string) {
  return prisma.cases.findUnique({
    where: { id },
    select: { id: true, status: true, archived: true },
  });
}
