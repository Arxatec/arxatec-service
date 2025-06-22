// src/modules/cases/features/case_detail/data/case_detail.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CaseDetailRepository {
  getById(id: number) {
    return prisma.cases.findUnique({
      where: { id },
      include: {
        service: {
          include: {
            attachments: { where: { archived: false } },
            messages: true,
            consultations: true,
          },
        },
        histories: true,
        category: true,
        status: true,
      },
    });
  }
}
