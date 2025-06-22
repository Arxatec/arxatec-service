// src/modules/cases/features/archive_case/data/archive_case.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ArchiveCaseRepository {
  async findCaseLight(id: number) {
    return prisma.cases.findUnique({
      where: { id },
      select: {
        id: true,
        status_id: true,
        archived: true,
      },
    });
  }
}
