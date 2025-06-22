// src/modules/cases/features/reopen_case/data/reopen_case.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ReopenCaseRepository {
  async findCaseById(id: number) {
    return prisma.cases.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });
  }

  async restoreCase(id: number, userId: number) {
    return prisma.$transaction(async (tx) => {
      await tx.caseHistories.create({
        data: {
          case_id: id,
          changed_by: userId,
          field: "archived",
          old_value: "true",
          new_value: "false",
          note: "Case reopened",
        },
      });

      return tx.cases.update({
        where: { id },
        data: { archived: false },
      });
    });
  }
}
