// src/modules/cases/features/manage/archive/data/archive_case.repository.ts
import prisma from "../../../../../../config/prisma_client";

export class ArchiveCaseRepository {
  findCaseLight(id: string) {
    return prisma.cases.findUnique({
      where: { id },
      select: { id: true, status_id: true, archived: true },
    });
  }
}
